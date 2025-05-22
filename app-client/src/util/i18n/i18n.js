import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import COMMON_EN from '../locale/en/common.json'
import COMMON_VI from '../locale/vi/common.json'
import VALIDATION_EN from '../locale/en/validation.json'
import VALIDATION_VI from '../locale/vi/validation.json'

const resources = {
    en: {
        common: COMMON_EN,
        validation: VALIDATION_EN,
    },
    vi: {
        common: COMMON_VI,
        validation: VALIDATION_VI,
    },
}

i18n.use(initReactI18next).init({
    resources: resources,
    lng: localStorage.getItem('lang') || 'vi',
    fallbackLng: 'vi',
    ns: ['common', 'validation'],
    defaultNS: 'common',

    interpolation: {
        escapeValue: false,
    },
})

export default i18n
