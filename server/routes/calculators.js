const express = require('express');
const jwt = require('jsonwebtoken');

const { MongoClient, ObjectId } = require('mongodb');

const calcCalculator = require('../calculators/calc-calculator.js');
const bayesCalculator = require('../calculators/bayes-calculator.js');
const router = express.Router();

const verifyToken = async (req, res, next) => {
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

      const standardTools = require('../../tools');
      const standardTool = standardTools.find(e => e.url === toolUrl);
      console.log('standardTool', standardTool);

      const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
      const collection = mongo.db('OD-toolkit').collection('accounts');

      const user = await collection.findOne({ "_id": ObjectId(req.userId) });
      const toolAuth = user.tools.find(e => e.url === toolUrl);

      let auth = standardTool.openForAccounts || false;
      auth = toolAuth && toolAuth.auth || auth;

      console.log('api calc auth', auth);

      if (auth) { //TODO: backend doesnt have general tools auth
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

router.get('/bayesiaanse-calculator', async (req, res) => {
  const result = await bayesCalculator(req.query);

  res.status(200).send(result);
});

module.exports = router;