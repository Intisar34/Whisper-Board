const express = require('express');
const router = express.Router();

const {
    translateText
} = require('../services/translate')

router.post('/', translateText)

module.exports = router;