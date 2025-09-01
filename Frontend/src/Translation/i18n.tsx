import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translationEnglish from './English/translation.json'
import amharicTranslation from './Amharic/translation.json'
import ChineseTranslation from './Chinese/translation.json'
import AzerbaijaniTranslation from './Azerbaijani/translation.json'
const resources ={
    en: {
        translation: translationEnglish
    },
    am: {
        translation: amharicTranslation
    },
    cn: {
        translation: ChineseTranslation
    },
    az: {
        translation: AzerbaijaniTranslation
    }
}

i18next.use(initReactI18next).init({resources, lng:"en"});
export default i18next;