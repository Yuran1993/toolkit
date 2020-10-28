const express = require('express');
const router = express.Router();
const calc = require('./calculators');
router.use('/calc', calc);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });
const { MongoClient, ObjectId } = require('mongodb');

const verifyToken = async (req, res, next) => {
  const path = req.route.path;
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];
  if (token) {
    const payload = jwt.verify(token, 'toolkitKey'); // in .env
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

router.post('/login', async (req, res) => {
  const userData = req.body;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  const user = await collection.findOne({ email: userData.email });

  if (user) {
    if (user.verified) {
      bcrypt.compare(userData.password, user.password, function (err, result) {
        if (result) {
          const payload = { subject: user._id };
          const token = jwt.sign(payload, 'toolkitKey');
          res.status(200).send({ token, user });
        } else {
          res.status(401).send({ err: 'password incorrect', text: 'Het opgegeven wachtwoord komt niet overeen met het e-mailadres.<br>Probeer het nogmaals of reset je wachtwoord.' })
        }
      });
    } else {
      res.status(401).send({ err: 'not verifieed', text: 'Verifieer alstublieft eerst uw account via de email die u heeft ontvangen op het bovenstaande email adres.' });
    }
  } else {
    res.status(401).send({ err: 'not Found', text: 'Het opgegeven e-mailadres komt niet voor in ons bestand.<br>Gebruik een ander e-mailadres of meld je aan.' });
  }

  mongo.close();
});

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

      // TODO geeft de inserOne() het _id terug?
      await collection.insertOne(newAccount);
      newAccount = await collection.findOne({ email: userData.email.value });
      mongo.close();

      let text =
        `Verifieer uw OD-toolkit account via de volgende url: ${req.headers.host}/?ID=${newAccount._id}`;

      var mail = {
        from: 'OD-auto <dev@onlinedialogue.com>',
        to: 'yuran@onlinedialogue.com',
        subject: 'OD-toolkit: acocount verifieeren',
        text
      };

      // TODO
      mailgun.messages().send(mail, function (err, body) {
        if (err) console.log(err);
        res.status(200).send();

      });
    });
  } else {
    res.status(401).send('Er bestaat al een account met het opgegeven emailadres');
  }
});

router.post('/sendVerifyMail', async (req, res) => {
  const email = req.body.value;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  const user = await collection.findOne({ email });
  mongo.close();

  if (user) {
    let text = `Verifieer uw OD-toolkit account via de volgende url: ${req.headers.host}/?ID=${user._id}`;

    var mail = {
      from: 'OD-auto <dev@onlinedialogue.com>',
      to: 'yuran@onlinedialogue.com',
      subject: 'OD-toolkit: account verifieren',
      text
    };

    mailgun.messages().send(mail, function (err, body) {
      if (err) console.log(err);
      res.status(200).send();

    });
  } else {
    res.status(401).send('Geen account gevonden op email adres:' + userData.email.value);
  }
});

router.get('/getTools', (req, res) => {
  const tools = require('../../tools');
  var json = JSON.stringify(tools);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(json);
});

router.get('/getUser', verifyToken, async (req, res) => {
  const id = req.userId; //TODO: verifyToken token does this, maybe remove verifyToken en move functionality in this function cause this is the only function that uses it
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ "_id": ObjectId(id) });

  mongo.close();
  res.status(200).send(user);
});

router.post('/forgotPasswordMail', async (req, res) => {
  const emailAdres = req.body.value;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ email: emailAdres });

  if (user) {
    await collection.updateOne(user, { $set: { "changePassword": true } });
    let text =
      `Verander uw OD-toolkit wachtwoord via de volgende url: ${req.headers.host}/?PW=${user._id}`;

    var mail = {
      from: 'OD-auto <dev@onlinedialogue.com>',
      to: 'yuran@onlinedialogue.com',
      subject: 'OD-toolkit: wachtwoord aanpassen',
      text
    };

    // TODO
    // mailgun.messages().send(mail, function (err, body) {
    //   if (err) console.log(err);
    //   res.status(200).send();
    // });
    console.log(mail);
    res.status(200).send();
  } else {
    res.status(401).send('Het opgegeven e-mailadres komt niet voor in ons bestand.<br>Gebruik een ander e-mailadres of meld je aan.');
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

      console.log('api/changePassword', userData);

      //TODO mail versturen dat het email is aangepast.

      const payload = { subject: user._id };
      const token = jwt.sign(payload, 'toolkitKey');
      res.status(200).send({ token, user });
    });

  } else {
    res.status(401).send('De link voor het aanpassen van uw wachtwoord is niet langer actief, gebruik nogmaals de wachtwoord vergeten optie voor een nieuwe link')
  }

});

module.exports = router;