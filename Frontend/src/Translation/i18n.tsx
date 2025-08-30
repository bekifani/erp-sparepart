import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translationEnglish from './English/translation.json'
import amharicTranslation from './Amharic/translation.json'
const resources ={
    en: {
        translation: translationEnglish
    },
    am: {
        translation: amharicTranslation
    }
}

i18next.use(initReactI18next).init({resources, lng:"en"});
export default i18next;