const express = require('express');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const { MongoClient, ObjectId } = require('mongodb');

const calc = require('./calculators');

// const users = require('../Users');
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });

const router = express.Router();

router.use('/calc', calc);

router.post('/login', async (req, res) => {
  const userData = req.body;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  const user = await collection.findOne({ email: userData.email.value });

  if (user) {
    bcrypt.compare(userData.password, user.password, function (err, result) {
      if (result) {
        const payload = { subject: user._id };
        const token = jwt.sign(payload, 'toolkitKey');
        res.status(200).send({ token, user });
      } else {
        res.status(401).send('Het opgegeven wachtwoord komt niet overeen met het e-mailadres.<br>Probeer het nogmaals of reset je wachtwoord.')
      }
    });
  } else {
    res.status(401).send('Het opgegeven e-mailadres komt niet voor in ons bestand.<br>Gebruik een ander e-mailadres of meld je aan.');
  }

  mongo.close();

  // if (user) {
  //   if (user.password === userData.password) {
  //     const payload = { subject: user._id };
  //     const token = jwt.sign(payload, 'toolkitKey');
  //     res.status(200).send({ token, user });
  //   } else {
  //     res.status(401).send('Het opgegeven wachtwoord komt niet overeen met het e-mailadres.<br>Probeer het nogmaals of reset je wachtwoord.');
  //   }
  // } else {
  //   res.status(401).send('Het opgegeven e-mailadres komt niet voor in ons bestand.<br>Gebruik een ander e-mailadres of meld je aan.');
  // }
});

router.post('/register', async (req, res) => {
  const userData = req.body;
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  const alreadyInDB = await collection.findOne({ email: userData.email.value });

  if (!alreadyInDB) {
    bcrypt.hash(userData.password.value, saltRounds, async function (err, hash) {
      const newAccount = {
        name: userData.name.value,
        company: userData.company.value,
        email: userData.email.value,
        password: hash,
        tools: [],
      };

      collection.insertOne(newAccount);


      res.status(200).send();
      mongo.close();
    });
  } else {

    res.status(401).send('Er bestaat al een account op het opgegeven emailadres');
  }




  //   const text =
  //     `OD-toolkit: nieuwe registratie:

  // Naam: ${userData['name'].value}
  // Email: ${userData['email'].value}
  // Bedrijf: ${userData['company'].value}
  // `;

  //   var mail = {
  //     from: 'OD-auto <dev@onlinedialogue.com>',
  //     to: 'yuran@onlinedialogue.com',
  //     subject: 'Nieuwe registratie OD-toolkit',
  //     text
  //   };

  //   mailgun.messages().send(mail, function (err, body) {
  //     if (err) console.log(err) && res.status(200).send();
  //     res.status(200).send();
  //   });
});

const verifyToken = (req, res, next) => {
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
        const toolUrl = path.split('/')[2];
        const user = users.find((e) => e._id === payload.subject); //TODO users uit mongo halen en mongo requests verminderen in de api
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

router.get('/getTools', (req, res) => {
  const tools = require('../../tools');
  var json = JSON.stringify(tools);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(json);
});

router.get('/getUser', verifyToken, async (req, res) => {
  const id = req.userId; //TODO: verifyToken token does this, maybe remove verifyToken en move functionality in this function
  console.log(id, 'id');
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ "_id": ObjectId(id) });
  console.log(user, 'user');

  mongo.close();

  res.status(200).send(user);
});

// router.post('/addToolReq', verifyToken, (req, res) => {
//   const id = req.userId;
//   const user = users.find(e => e._id === id);
//   const data = req.body;

//   let text =
//     `Gebruiker: ${user.email},
// vraagt toegang tot de volgende tool: ${data.tool}
  
// `;

//   var mail = {
//     from: 'OD-auto <dev@onlinedialogue.com>',
//     to: 'yuran@onlinedialogue.com',
//     subject: 'OD-toolkit: tools aanvraag',
//     text
//   };

//   mailgun.messages().send(mail, function (err, body) {
//     if (err) console.log(err);
//   });
// });

router.post('/forgotPassword', (req, res) => {
  const emailAdres = req.body.value;
  const user = users.find(e => e.email === emailAdres);

  if (user) {
    let text =
      `Gebruiker: ${emailAdres},
vraagt het wachtwoord van het OD-toolkit account opnieuw op.
`;

    var mail = {
      from: 'OD-auto <dev@onlinedialogue.com>',
      to: 'yuran@onlinedialogue.com',
      subject: 'OD-toolkit: wachtwoord aanvraag',
      text
    };

    mailgun.messages().send(mail, function (err, body) {
      if (err) console.log(err);
      res.status(200).send();
    });
  } else {
    res.status(401).send('Het opgegeven e-mailadres komt niet voor in ons bestand.<br>Gebruik een ander e-mailadres of meld je aan.');
  }
});

module.exports = router;