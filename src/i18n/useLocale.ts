import { useTranslation } from 'react-i18next'

export type Lang = 'it' | 'en'

/** Locale per `Intl`: italiano o inglese britannico (stesso ordine giorno-mese, 24 ore). */
const LOCALES: Record<Lang, string> = { it: 'it-IT', en: 'en-GB' }

/** Lingua attiva (ridotta a it/en: `i18n.language` può essere anche `en-US`) e relativo locale `Intl`. */
export function useLocale() {
    const { i18n } = useTranslation()
    const lang: Lang = i18n.resolvedLanguage === 'en' ? 'en' : 'it'
    return { lang, locale: LOCALES[lang] }
}
