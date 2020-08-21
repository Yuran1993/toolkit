require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const api = require('./routes/api');

app.use(bodyParser.json());

app.use('/api', api);
app.get('/', (req, res) => res.send('hola'));

app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${process.env.PORT}`);
});