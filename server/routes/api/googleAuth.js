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
  const path = req.route.path;
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }

  let token = req.headers.authorization.split(' ')[1];
  if (token) {
    const payload = jwt.verify(token, process.env.jwtKey);
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

const getMongoAccountCol = () => {
  return new Promise(async resolve => {
    const mongo = await MongoClient.connect(process.env.MONGO, { useUnifiedTopology: true });
    const collection = mongo.db('OD-toolkit').collection('accounts');

    resolve(collection);
  });
}

router.get('/login', async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: JSON.stringify({ component: req.headers.referer })
  });
  res.status(200).send({ url });
});

router.post('/setToken', verifyToken, async (req, res) => {
  const go = async () => {
    const { code } = req.body
    const { tokens } = await oauth2Client.getToken(code);

    const collection = await getMongoAccountCol();
    await collection.findOneAndUpdate({ "_id": ObjectId(req.userId) }, { $set: { "google.googleTokens": JSON.stringify(tokens) } });

    oauth2Client.setCredentials(tokens);
    res.status(200).send(tokens);
  }

  go() //.catch(err => console.log(err))
});
router.get('/findToken', verifyToken, async (req, res) => {
  const collection = await getMongoAccountCol();
  const user = await collection.findOne({ "_id": ObjectId(req.userId) });
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
  const accounts = await google.analytics('v3').management.accounts.list();

  res.status(200).send(accounts.data.items);
});
router.get('/getAnalyticsProperties', async (req, res) => {
  const accountID = req.get('accountID');
  const properties = await google.analytics('v3').management.webproperties.list({
    'accountId': accountID
  });

  res.status(200).send(properties.data.items);
});

router.get('/getAnalyticsViews', async (req, res) => {
  const accountID = req.get('accountID');
  const PropertyID = req.get('PropertyID');
  const views = await google.analytics('v3').management.profiles.list({
    'accountId': accountID,
    'webPropertyId': PropertyID
  });

  res.status(200).send(views.data.items);
});

router.post('/saveUserSettings', verifyToken, async (req, res) => {
  const userSettings = req.body;

  console.log(userSettings);

  const collection = await getMongoAccountCol();
  await collection.findOneAndUpdate({ "_id": ObjectId(req.userId) }, { $set: { "google.userSettings": JSON.stringify(userSettings) } });

  res.status(200).send();
});

router.get('/getUserSettings', verifyToken, async (req, res) => {
  const collection = await getMongoAccountCol();
  const user = await collection.findOne({ "_id": ObjectId(req.userId) });
  let googleAuth = user.google;

  if (googleAuth && googleAuth.userSettings) {
    let userSettings = googleAuth.userSettings
    userSettings = JSON.parse(userSettings);

    res.status(200).send(userSettings);
  } else {
    res.status(200).send();
  }
});

//   const results = await google.analytics('v3').data.ga.get({
//     'auth': oauth2Client,
//     'ids': 'ga:' + temp3.data.items[0].id,

//     'start-date': '2020-11-01',
//     'end-date': 'today',
//     'metrics': 'ga:users, ga:transactionRevenue',
//     'dimensions': 'ga:date, ga:eventAction',
//   });

module.exports = router;


