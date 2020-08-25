const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../Users');

const calc = require('./calculators')

const router = express.Router();

router.use('/calc', calc);

router.post('/login', (req, res) => {
  const userData = req.body;
  const user = users.find((e) => e.email === userData.email);

  if (user) {
    if (user.password === userData.password) {
      const payload = {subject: user._id};
      const token = jwt.sign(payload, 'toolkitKey');
      res.status(200).send({token, tools: user.tools});
    } else {
      res.status(401).send('Password incorrect');
    }
  } else {
    res.status(401).send('User not found');
  }
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
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(json);
});

router.get('/toolsAuth', verifyToken, (req, res) => {
  const id = req.userId;
  const user = users.find(e => e._id === id);

  res.status(200).send(user.tools);
});

module.exports = router;