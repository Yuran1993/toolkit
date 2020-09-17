const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../Users');

const calcCalculator = require('../calculators/calc-calculator.js');
const bayesCalculator = require('../calculators/bayes-calculator.js');
const router = express.Router();

const verifyToken = (req, res, next) => {
  const path = req.route.path;
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];
  if (token) {
    const payload = jwt.verify(token, 'toolkitKey'); // in .env
    if (payload) {
      req.userId = payload.subject;
      const toolUrl = path.split('/')[1];
      const user = users.find((e) => e._id === payload.subject);
      const toolAuth = user.tools.find(e => e.url === toolUrl)

      if (toolAuth && toolAuth.auth) {
        next();
      } else {
        return res.status(401).send('Unauthorized request');
      }
    } else {
      return res.status(401).send('Unauthorized request');
    }
  } else {
    return res.status(401).send('Unauthorized request');
  }
}

router.get('/abtest-calculator', async (req, res) => {
  const result = await calcCalculator(req.query);
  res.status(200).send(result);
});

router.get('/bayes-calculator', async (req, res) => {
  const result = await bayesCalculator(req.query);
  
  res.status(200).send(result);
});

module.exports = router;