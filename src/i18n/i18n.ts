import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  // сами переводы должны лежать в public/locales/ru или en
  .init({
    fallbackLng: 'ru',
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

export default i18n
