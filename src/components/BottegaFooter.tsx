import { Clock, MapPin, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { describeOpeningHours } from '../data/booking'
import { CONTACTS } from '../data/contacts'
import { useLocale } from '../i18n/useLocale'

const YEAR = new Date().getFullYear()

export function BottegaFooter() {
    const { t } = useTranslation()
    const { locale } = useLocale()
    const hours = describeOpeningHours(locale)
    return (
        <footer id="contatti" className="border-t border-white/10 bg-ink-900 text-white/70">
            <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-3">
                    <div>
                        <p className="font-display text-lg font-extrabold text-white uppercase">
                            Bottega del Taglio
                        </p>
                        <p className="mt-3 text-sm leading-relaxed">
                            {t('footer.tagline')}
                        </p>
                    </div>

                    <div className="flex items-start gap-3 text-sm">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-neon-cyan-400" />
                        <span>
                            {CONTACTS.street}
                            <br />
                            {CONTACTS.city}
                        </span>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Phone className="size-4 shrink-0 text-neon-cyan-400" />
                            {/* Mockato: progetto dimostrativo, non avvia una chiamata reale. */}
                            <span>{CONTACTS.phone}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="mt-0.5 size-4 shrink-0 text-neon-cyan-400" />
                            <span>
                                {hours.days} {hours.ranges.join(' · ')}
                                <br />
                                {t('hours.closed', { day: hours.closedDay })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-6 text-xs">
                    <p>© {YEAR} Bottega del Taglio</p>
                </div>
            </div>
        </footer>
    )
}
