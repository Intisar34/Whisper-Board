const axios  = require('axios')

const API_KEY = procces.env.GOOGLE_API_KEY

exports.translateText = async(req, res) => {
    const {text, targetLangage} = req.body
    try {
        const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?Key=${API_KEY}`,{
            q: text,
            target: targetLangage || 'SV'
        })

        const data = response.data
        res.json({
            translatedText: data.data.translations[0].translatedText
        })
    } catch (err) {
        console.error('Google Translate API error:', err.response?.data || err.message);
        res.status(502).json({ error: 'Translation failed' });
    }
}