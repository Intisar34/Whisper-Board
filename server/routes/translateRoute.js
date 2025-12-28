const express = require('express');
const router = express.Router();

const {
    translateText
} = require('../services/translate')

router.post('/api/v1/translate', translateText)

module.exports = router;