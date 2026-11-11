import { useTranslation } from 'react-i18next'
import type { Lang } from '../i18n/useLocale'
import { useLocale } from '../i18n/useLocale'

const LANGS: Lang[] = ['it', 'en']

/** Selettore IT/EN a pillola: la scelta resta salvata nel browser (vedi i18n/index.ts). */
export function LanguageSwitch() {
    const { t, i18n } = useTranslation()
    const { lang } = useLocale()

    function choose(next: Lang) {
        if (next === lang) return
        i18n.changeLanguage(next)
        // Toglie un eventuale ?lng= dall'URL, altrimenti al ricaricamento avrebbe la precedenza sulla scelta.
        const url = new URL(window.location.href)
        if (url.searchParams.has('lng')) {
            url.searchParams.delete('lng')
            window.history.replaceState(null, '', url)
        }
    }

    return (
        <div
            role="group"
            aria-label={t('nav.language')}
            className="flex shrink-0 rounded-full bg-white/5 p-0.5 ring-1 ring-white/15"
        >
            {LANGS.map((l) => (
                <button
                    key={l}
                    type="button"
                    lang={l}
                    aria-pressed={lang === l}
                    onClick={() => choose(l)}
                    className={`rounded-full px-2 py-1 text-xs font-bold uppercase transition sm:px-2.5 ${
                        lang === l ? 'bg-neon-cyan-500 text-ink-950' : 'text-white/70 hover:text-white'
                    }`}
                >
                    {l}
                </button>
            ))}
        </div>
    )
}
