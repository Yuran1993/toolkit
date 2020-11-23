const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN, host: "api.eu.mailgun.net" });


const verifyToken = async (req, res, next) => {
  //? checking if the user is loggedin
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];
  if (token) {
    const payload = jwt.verify(token, process.env.jwtKey);
    if (payload) {
      req.userId = payload.subject;
      next();

    } else {
      return res.status(401).send('Unauthorized request');
    }
  } else {
    return res.status(401).send('Unauthorized request');
  }
}

const sendVerifyMail = (host, id, email) => {
  let text = `Hello,

Please verify your account for Online Dialogue’s CRO toolkit via the following link:
${host}/?ID=${id}

Kind Regards,

Online Dialogue

Sint Jacobsstraat 31 
3511 BL Utrecht
The Netherlands`;

  var mail = {
    from: 'OD-toolkit <dev@onlinedialogue.com>',
    to: email,
    subject: 'Online Dialogue toolkit: verification needed',
    text
  };

  mailgun.messages().send(mail, function (err, body) {
    if (err) console.log(err);
  });
}

router.post('/register', async (req, res) => {
  const userData = req.body;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  //? checking if the email already exists in de database
  const alreadyInDB = await collection.findOne({ email: userData.email.value });

  if (!alreadyInDB) {
    //? creating new account and hashing the password
    bcrypt.hash(userData.password.value, saltRounds, async function (err, hash) {
      let newAccount = {
        name: userData.name.value,
        company: userData.company.value,
        email: userData.email.value,
        password: hash,
        tools: [],
      };

      //? adding new account to database
      newAccount = await collection.insertOne(newAccount);
      newAccount = newAccount.ops[0];
      mongo.close();

      //? send verify mail
      sendVerifyMail(req.headers.host, newAccount._id, newAccount.email);

      res.status(200).send();
    });
  } else {
    mongo.close();
    res.status(401).send('There already exist an account using the provided email adress.');
  }
});

router.post('/verifyUser', async (req, res) => {
  const id = req.body.ID;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  try {
    //? getting user from database
    const user = await collection.findOne({ "_id": ObjectId(id) });

    //? verifying user and updating the database
    if (!user.verified) {
      await collection.updateOne(user, { $set: { "verified": true } });

      const payload = { subject: user._id };
      const token = jwt.sign(payload, 'toolkitKey');
      res.status(200).send({ token, user });

    } else {
      return res.status(200).send();
    }
  } catch (err) {
    //? user not found in database
    return res.status(401).send('Unauthorized request');
  }

  mongo.close();
});

router.post('/sendVerifyMail', async (req, res) => {
  const email = req.body.value;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  //? getting the user out of the database
  const user = await collection.findOne({ email });
  mongo.close();

  if (user) {
    //? sending verification mail
    sendVerifyMail(req.headers.host, user._id, email);

    res.status(200).send();
  } else {
    res.status(401).send('No account found with the provided email adress.');
  }
});

router.post('/login', async (req, res) => {
  const userData = req.body;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  const user = await collection.findOne({ email: userData.email });

  //? when the user is able to login,then "changePassword" doens't need to be true
  if (user && user.changePassword) {
    await collection.updateOne(user, { $set: { "changePassword": false } });
  }
  mongo.close();

  //? user found in database
  if (user) {
    //? user is verified
    if (user.verified) {
      //? comparing passwords
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
  //? sending tools to frontend
  const tools = require('../../../tools');
  res.status(200).send(tools);
});

router.get('/getUser', verifyToken, async (req, res) => {
  //? send user info to frontend
  const id = req.userId;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ "_id": ObjectId(id) });

  mongo.close();
  res.status(200).send(user);
});

router.get('/deleteUser', verifyToken, async (req, res) => {
  //? delete user
  const id = req.userId;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  await collection.deleteOne({ "_id": ObjectId(id) });

  mongo.close();
  res.status(200).send();
});

router.post('/forgotPasswordMail', async (req, res) => {
  //? sending forgot password email
  const emailAdres = req.body.value;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ email: emailAdres });

  if (user) {
    await collection.updateOne(user, { $set: { "changePassword": true } });
    let text =
      `Hello ${user.name},

Please change the password of your Online Dialogue toolkit account thru the following link:
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

  //? checking if the database stats that the user wants to change the password
  if (user.changePassword) {
    //? hashing new password
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


