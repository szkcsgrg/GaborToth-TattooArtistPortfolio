import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import hu from './locales/hu.json'
import en from './locales/en.json'
import de from './locales/de.json'
import it from './locales/it.json'

const savedLang = localStorage.getItem('language') || 'hu'

i18n.use(initReactI18next).init({
  resources: {
    hu: { translation: hu },
    en: { translation: en },
    de: { translation: de },
    it: { translation: it },
  },
  lng: savedLang,
  fallbackLng: 'hu',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng)
})

export default i18n
