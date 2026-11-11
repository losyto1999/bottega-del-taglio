import { Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import logo from '../assets/logo.webp'
import { LanguageSwitch } from './LanguageSwitch'

const LINKS = [
    { href: '#servizi', key: 'nav.services' },
    { href: '#prenota', key: 'nav.book' },
    { href: '#contatti', key: 'nav.contact' },
]

export function BottegaNav() {
    const { t } = useTranslation()
    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-950/90 backdrop-blur-lg">
            {/* Aperta dal portfolio (back:), il pl maggiorato lascia spazio alla pillola fissa "torna al portfolio"
                in alto a sinistra, che finisce a 82px (104px da sm). */}
            <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8 back:pl-[5.625rem] back:sm:pl-28 back:lg:pl-32">
                <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                    <img src={logo} alt="" className="size-10 shrink-0 rounded-lg max-[374px]:hidden sm:size-14" />
                    <span className="truncate font-display text-base font-extrabold tracking-tight text-white uppercase sm:text-xl">
                        Bottega del Taglio
                    </span>
                </a>

                <ul className="hidden items-center gap-8 sm:flex">
                    {LINKS.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                className="text-sm font-semibold text-white/80 transition hover:text-neon-cyan-400"
                            >
                                {t(link.key)}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <LanguageSwitch />
                    {/* Mockato: progetto dimostrativo, il pulsante non avvia una chiamata reale. */}
                    <button
                        type="button"
                        aria-label={t('nav.call')}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-neon-pink-500 px-3 py-2.5 text-sm font-bold text-ink-950 shadow-neon-pink transition hover:-translate-y-0.5 hover:bg-neon-pink-400 sm:px-5"
                    >
                        <Phone className="size-4" />
                        <span className="hidden sm:inline">{t('nav.call')}</span>
                    </button>
                </div>
            </nav>
        </header>
    )
}
