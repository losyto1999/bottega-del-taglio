import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from '../locales/en.json'
import it from '../locales/it.json'

// Lingua: `?lng=en` / `?lng=it` nell'URL, poi la scelta salvata dal selettore nella nav,
// infine quella del browser (italiano come ripiego).
i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { it: { bottega: it }, en: { bottega: en } },
        ns: ['bottega'],
        defaultNS: 'bottega',
        supportedLngs: ['it', 'en'],
        nonExplicitSupportedLngs: true,
        fallbackLng: 'it',
        interpolation: { escapeValue: false },
        detection: {
            order: ['querystring', 'localStorage', 'navigator'],
            lookupQuerystring: 'lng',
            lookupLocalStorage: 'bottega-del-taglio:lang',
            caches: ['localStorage'],
        },
    })

const syncHtmlLang = (lng: string) => {
    document.documentElement.lang = lng.slice(0, 2)
}
syncHtmlLang(i18n.resolvedLanguage ?? 'it')
i18n.on('languageChanged', syncHtmlLang)

// `?lng=` è già stato letto e salvato nel localStorage: lo si toglie dall'URL, che resta pulito e,
// ricaricando, non ha la precedenza su una scelta fatta poi con il selettore.
const url = new URL(window.location.href)
if (url.searchParams.has('lng')) {
    url.searchParams.delete('lng')
    window.history.replaceState(window.history.state, '', url)
}

export default i18n
