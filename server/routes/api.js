const express = require('express');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });
const users = require('../Users');

const calc = require('./calculators')

const router = express.Router();

router.use('/calc', calc);

router.post('/login', (req, res) => {
  const userData = req.body;
  const user = users.find((e) => e.email === userData.email.value);
  console.log(req.body);
  console.log(users);

  if (user) {
    if (user.password === userData.password) {
      const payload = { subject: user._id };
      const token = jwt.sign(payload, 'toolkitKey');
      res.status(200).send({ token, user });
    } else {
      res.status(401).send('Wachtwoord incorrect');
    }
  } else {
    res.status(401).send('E-mailadres niet gevonden');
  }
});

router.post('/register', (req, res) => {
  const userData = req.body;

  const text =
    `OD-toolkit: nieuwe registratie:

Naam: ${userData['name'].value}
Email: ${userData['email'].value}
Bedrijf: ${userData['company'].value}
`;

  var mail = {
    from: 'OD-auto <dev@onlinedialogue.com>',
    to: 'yuran@onlinedialogue.com',
    subject: 'Nieuwe registratie OD-toolkit',
    text
  };

  //res.status(200).send();

  mailgun.messages().send(mail, function (err, body) {
    if (err) console.log(err) && res.status(200).send();
    res.status(200).send();
  });


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
        const user = users.find((e) => e._id === payload.subject);
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

router.get('/toolsAuth', verifyToken, (req, res) => {
  const id = req.userId;
  const user = users.find(e => e._id === id);

  res.status(200).send(user);
});

router.post('/addToolReq', verifyToken, (req, res) => {
  const id = req.userId;
  const user = users.find(e => e._id === id);
  const data = req.body;

  let text =
    `Gebruiker: ${user.email},
vraagt toegang tot de volgende tools:
  
`;

  Object.keys(data).forEach(e => {
    text += e + '\n';
  });

  var mail = {
    from: 'OD-auto <dev@onlinedialogue.com>',
    to: 'yuran@onlinedialogue.com',
    subject: 'OD-toolkit: tools aanvraag',
    text
  };

  mailgun.messages().send(mail, function (err, body) {
    if (err) console.log(err);
  });
});

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

    // console.log(text);

    // res.status(200).send();
  } else {
    res.status(401).send('E-mailadres niet gevonden');
  }
});

module.exports = router;