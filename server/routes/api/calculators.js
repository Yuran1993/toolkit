const express = require('express');
const jwt = require('jsonwebtoken');

const { MongoClient, ObjectId } = require('mongodb');

const calcCalculator = require('../../calculators/calc-calculator.js');
const bayesCalculator = require('../../calculators/bayes-calculator.js');
const router = express.Router();

const verifyToken = async (req, res, next) => {
  //? checking if user is logged in and has auth for the tool
  const path = req.route.path;
  const toolUrl = path.split('/')[1];

  const allTools = require('../../../tools');
  const tool = allTools.find(e => e.url === toolUrl);

  if (tool.open) {
    next();
    return;
  };

  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];
  console.log(token);
  if (token) {
    const payload = jwt.verify(token, process.env.jwtKey); // in .env
    if (payload) {
      req.userId = payload.subject;

      const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
      const collection = mongo.db('OD-toolkit').collection('accounts');

      const user = await collection.findOne({ "_id": ObjectId(req.userId) });
      const userAuth = user.tools.find(e => e.url === toolUrl);
      const standardAuth = tool.openForAccounts;

      let auth = userAuth && userAuth.auth || standardAuth;

      if (auth) {
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

router.get('/abtest-calculator', verifyToken, async (req, res) => {
  const result = await calcCalculator(req.query);
  res.status(200).send(result);
});

router.get('/bayesiaanse-calculator', verifyToken, async (req, res) => {
  const result = await bayesCalculator(req.query);
  res.status(200).send(result);
});

module.exports = router;