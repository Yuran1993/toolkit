const express = require('express');
const router = express.Router();
const calc = require('./calculators');
const googleAuth = require('./googleAuth');
router.use('/calc', calc);
router.use('/googleAuth', googleAuth);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN, host: "api.eu.mailgun.net" });
const { MongoClient, ObjectId } = require('mongodb');

const verifyToken = async (req, res, next) => {
  const path = req.route.path;
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];
  if (token) {
    const payload = jwt.verify(token, process.env.jwtKey);
    if (payload) {
      if (path.indexOf('calc') === -1) {
        req.userId = payload.subject;
        next();
      } else {
        req.userId = payload.subject;
        const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
        const collection = mongo.db('OD-toolkit').collection('accounts');
        const user = await collection.findOne({ "_id": ObjectId(id) });
        const toolUrl = path.split('/')[2];

        const toolAuth = user.tools.find(e => e.url === toolUrl)

        if (toolAuth && toolAuth.auth) {
          next()
        } else {
          return res.status(401).send('Unauthorized request');
        }
      }
    } else {
      return res.status(401).send('Unauthorized request');
    }
  } else {
    return res.status(401).send('Unauthorized request');
  }
}

router.post('/register', async (req, res) => {
  const userData = req.body;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  const alreadyInDB = await collection.findOne({ email: userData.email.value });

  if (!alreadyInDB) {
    bcrypt.hash(userData.password.value, saltRounds, async function (err, hash) {
      let newAccount = {
        name: userData.name.value,
        company: userData.company.value,
        email: userData.email.value,
        password: hash,
        tools: [],
      };

      newAccount = await collection.insertOne(newAccount);
      newAccount = newAccount.ops[0];
      mongo.close();

      let text = `Hello,

Please verify your account for Online Dialogue’s CRO toolkit via the following link:
${req.headers.host}/?ID=${newAccount._id}

Kind Regards,

Online Dialogue

Sint Jacobsstraat 31 
3511 BL Utrecht
The Netherlands`;

      var mail = {
        from: 'OD-toolkit <dev@onlinedialogue.com>',
        to: userData.email.value,
        subject: 'Online Dialogue toolkit: verification needed',
        text
      };

      mailgun.messages().send(mail, function (err, body) {
        if (err) console.log(err);
        res.status(200).send();
      });
    });
  } else {
    res.status(401).send('There already exist an account using the provided email adress.');
  }
});

router.post('/verifyUser', async (req, res) => {
  const id = req.body.ID;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  try {
    const user = await collection.findOne({ "_id": ObjectId(id) });

    if (!user.verified) {
      await collection.updateOne(user, { $set: { "verified": true } });

      const payload = { subject: user._id };
      const token = jwt.sign(payload, 'toolkitKey');
      res.status(200).send({ token, user });

    } else {
      return res.status(200).send();
    }
  } catch (err) {
    return res.status(401).send('Unauthorized request');
  }

  mongo.close();
});

router.post('/sendVerifyMail', async (req, res) => {
  const email = req.body.value;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  const user = await collection.findOne({ email });
  mongo.close();

  if (user) {
    let text = `Hello,

Please verify your account for Online Dialogue’s CRO toolkit via the following link:
${req.headers.host}/?ID=${user._id}

Kind Regards,

Online Dialogue

Sint Jacobsstraat 31 
3511 BL Utrecht
The Netherlands `;

    var mail = {
      from: 'OD-toolkit <dev@onlinedialogue.com>',
      to: email,
      subject: 'Online Dialogue toolkit: verification needed',
      text
    };

    mailgun.messages().send(mail, function (err, body) {
      if (err) console.log(err);
      console.log(body);
      res.status(200).send();

    });
  } else {
    res.status(401).send('No account found with the provided email adress.');
  }
});

router.post('/login', async (req, res) => {
  const userData = req.body;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  const user = await collection.findOne({ email: userData.email });

  if (user && user.changePassword) { // Als de gebruiker kan inloggen dan hoeft changePassword niet op true
    await collection.updateOne(user, { $set: { "changePassword": false } });
  }
  mongo.close();

  if (user) {
    if (user.verified) {
      bcrypt.compare(userData.password, user.password, async function (err, result) {
        if (result) {
          const payload = { subject: user._id };
          const token = jwt.sign(payload, process.env.jwtKey);

          res.status(200).send({ token, user });
        } else {
          res.status(401).send({ err: 'password incorrect', text: 'The provided password does not match the email adress.<br>Please try again or reset your password.' })
        }
      });
    } else {
      res.status(401).send({ err: 'not verifieed', text: 'Your account still needs to be verified. Please check the email in your inbox for instructions.' }); // TODO
    }
  } else {
    res.status(401).send({ err: 'not Found', text: 'We cannot find the email address you provided. <br>Please use a different email address, or sign up.' });
  }
});

router.get('/getTools', (req, res) => {
  const tools = require('../../../tools');
  var json = JSON.stringify(tools);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(json);
});

router.get('/getUser', verifyToken, async (req, res) => {
  const id = req.userId;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ "_id": ObjectId(id) });

  mongo.close();
  res.status(200).send(user);
});

router.get('/deleteUser', verifyToken, async (req, res) => {
  const id = req.userId;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  await collection.deleteOne({ "_id": ObjectId(id) });

  mongo.close();
  res.status(200).send();
});

router.post('/forgotPasswordMail', async (req, res) => {
  const emailAdres = req.body.value;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ email: emailAdres });

  if (user) {
    await collection.updateOne(user, { $set: { "changePassword": true } });
    let text =
      `Hello ${user.name},

Please change the password of your Online Dialogue toolkit account via the following link:
${req.headers.host}/?PW=${user._id}

Kind Regards,

Online Dialogue

Sint Jacobsstraat 31 
3511 BL Utrecht
The Netherlands`;

    var mail = {
      from: 'OD-toolkit <dev@onlinedialogue.com>',
      to: emailAdres,
      subject: 'Online Dialogue toolkit: change password',
      text
    };

    mailgun.messages().send(mail, function (err, body) {
      if (err) console.log(err);
      res.status(200).send();
    });
  } else {
    res.status(401).send('No account found with the provided email adress.');
  }
});

router.post('/changePassword', async (req, res) => {
  const userData = req.body;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ "_id": ObjectId(userData.id) });

  if (user.changePassword) {
    bcrypt.hash(userData.newPassword, saltRounds, async function (err, hash) {
      await collection.updateOne(user, { $set: { "changePassword": false, "password": hash } });

      const payload = { subject: user._id };
      const token = jwt.sign(payload, process.env.jwtKey);
      res.status(200).send({ token, user });
    });
  } else {
    res.status(401).send('The forgot password link is no longer usable, for a new link use the “Forgot your password” option.');
  }
});


// TODO have to add: add tool
module.exports = router;