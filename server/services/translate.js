const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_API_KEY;

exports.translateText = async (req, res) => {
  const { text, targetLanguage } = req.body;

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        q: text,
        target: targetLanguage || 'sv'
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const data = response.data;

    res.json({
      translatedText: data.data.translations[0].translatedText
    });
  } catch (err) {
    console.error('Google Translate API error:', err.response?.data || err.message);
    res.status(502).json({ error: 'Translation failed' });
  }
};
