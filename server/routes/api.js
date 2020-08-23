const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../Users');

const router = express.Router();

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];
  if (token) {
    const payload = jwt.verify(token, 'toolkitKey');
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

router.get('/', (req, res) => {
  res.send('Yo');
});

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

module.exports = router;