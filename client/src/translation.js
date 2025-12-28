import { Api } from '@/Api'

export async function sendTranslation(text, targetLanguage) {
  const response = await Api.post('/translate', {
    text,
    targetLanguage
  })
  return response.data.translatedText
}
