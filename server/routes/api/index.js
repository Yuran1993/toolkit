const express = require('express');
const router = express.Router();
const ODauth = require('./ODauth')
const calc = require('./calculators');
const googleAuth = require('./googleAuth');

router.use('/ODauth', ODauth);
router.use('/calc', calc);
router.use('/googleAuth', googleAuth);

module.exports = router;