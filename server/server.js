require("dotenv").config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(__dirname + '/dist'));

const api = require('./routes/api');

app.use(bodyParser.json());

app.use('/api', api);
app.get('/*', (req, res)  => {
  res.sendFile(path.join(__dirname +'/dist/index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${process.env.PORT}`);
});