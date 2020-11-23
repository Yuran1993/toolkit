const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const { MongoClient, ObjectId } = require('mongodb');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET,
  process.env.GOOGLE_REDIRECT
);

const scopes = [
  'https://www.googleapis.com/auth/analytics.readonly',
];

google.options({ auth: oauth2Client });

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


router.get('/login', async (req, res) => {
  //? getting google login in link for the user
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: JSON.stringify({ component: req.headers.referer })
  });
  res.status(200).send({ url });
});

router.post('/setToken', verifyToken, async (req, res) => {
  //? save google auth token to the database 
  const { code } = req.body
  const { tokens } = await oauth2Client.getToken(code);

  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');

  await collection.findOneAndUpdate({ "_id": ObjectId(req.userId) }, { $set: { "google.googleTokens": JSON.stringify(tokens) } });

  mongo.close();

  oauth2Client.setCredentials(tokens);
  res.status(200).send(tokens);
});

router.get('/findToken', verifyToken, async (req, res) => {
  //? checking of google token is present in the database. If so, setting google credetials. If not, returning false
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ "_id": ObjectId(req.userId) });
  mongo.close();

  let googleAuth = user.google;

  if (googleAuth && googleAuth.googleTokens) {
    let tokens = googleAuth.googleTokens
    tokens = JSON.parse(tokens);

    oauth2Client.setCredentials(tokens);
    res.status(200).send({ auth: true });
  } else {
    res.status(200).send({ auth: false });
  }
});

router.get('/getAnalyticsAccounts', async (req, res) => {
  //? getting google analytics accounts
  const accounts = await google.analytics('v3').management.accounts.list();

  res.status(200).send(accounts.data.items);
});

router.get('/getAnalyticsProperties', async (req, res) => {
  //? getting google analytics properties
  const accountID = req.get('accountID');
  const properties = await google.analytics('v3').management.webproperties.list({
    'accountId': accountID
  });

  res.status(200).send(properties.data.items);
});

router.get('/getAnalyticsViews', async (req, res) => {
  //? getting google analytics views
  const accountID = req.get('accountID');
  const PropertyID = req.get('PropertyID');
  const views = await google.analytics('v3').management.profiles.list({
    'accountId': accountID,
    'webPropertyId': PropertyID
  });

  res.status(200).send(views.data.items);
});

router.post('/saveUserSettings', verifyToken, async (req, res) => {
  //? adding google analytics user settings (account, property and view) to the database
  const userSettings = req.body;

  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  await collection.findOneAndUpdate({ "_id": ObjectId(req.userId) }, { $set: { "google.userSettings": JSON.stringify(userSettings) } });
  mongo.close();

  res.status(200).send();

  getData(userSettings);
});

router.get('/getUserSettings', verifyToken, async (req, res) => {
  //? getting google analytics user settings (account, property and view) from the database
  const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
  const collection = mongo.db('OD-toolkit').collection('accounts');
  const user = await collection.findOne({ "_id": ObjectId(req.userId) });
  mongo.close();

  let googleAuth = user.google;

  if (googleAuth && googleAuth.userSettings) {
    let userSettings = googleAuth.userSettings
    userSettings = JSON.parse(userSettings);

    res.status(200).send(userSettings);
  } else {
    res.status(200).send();
  }
});

const getData = async (userSettings) => {
  //? gettting google analytics data
  const results = await google.analytics('v3').data.ga.get({
    'auth': oauth2Client,
    'ids': 'ga:' + userSettings.view,

    'start-date': '2020-11-01',
    'end-date': 'today',
    'metrics': 'ga:users',
    'dimensions': 'ga:deviceCategory',
  });

  console.log(results);
  console.log(results.data.items);
}

module.exports = router;


