const express = require('express');
const router = express.Router();

const users = require('../Users');

router.get('/', (req, res) => {
  res.send('Yo');
});
router.get('/getTools', (req, res) => {
  const tools = require('../../tools');
  var json = JSON.stringify(tools);
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(json);
});
router.post('/login', (req, res) => {
  const userData = req.body;
  const user = users.find((e) => e.email === userData.email);

  if (user) {
    if (user.password === userData.password) {
      res.status(200).send(userData);
    } else {
      res.status(401).send('Password incorrect');
    }
  } else {
    res.status(401).send('User not found');
  }
});

module.exports = router;