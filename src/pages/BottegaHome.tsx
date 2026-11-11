import { Phone, Scissors } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '../i18n/useLocale'
import { Reveal } from '../components/ui/Reveal'
import logo from '../assets/logo.webp'
import { BookingForm } from '../components/BookingForm'
import { describeOpeningHours } from '../data/booking'
import { formatPrice, SERVICES } from '../data/services'

export function BottegaHome() {
    const { t } = useTranslation()
    const { locale } = useLocale()
    const marqueeWords = t('marquee', { returnObjects: true }) as string[]
    const hours = describeOpeningHours(locale)
    return (
        <>
            <section
                id="top"
                className="neon-lines relative overflow-hidden px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8"
            >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-10 size-80 rounded-full bg-neon-pink-500/15 blur-3xl" />
                    <div className="absolute -right-20 top-40 size-80 rounded-full bg-neon-cyan-500/15 blur-3xl" />
                </div>

                <div className="mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">
                    <Reveal>
                        <span className="inline-flex items-center gap-2 rounded-full bg-neon-yellow-500/10 px-4 py-1.5 text-xs font-bold tracking-wide text-neon-yellow-400 uppercase">
                            <Scissors className="size-3.5" />
                            {t('hero.badge')}
                        </span>

                        <h1 className="neon-glow motion-safe:animate-flicker mt-6 text-4xl leading-[1.05] font-extrabold sm:text-5xl">
                            Bottega del Taglio
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                            {t('hero.text')}
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <a
                                href="#prenota"
                                className="inline-flex items-center gap-2 rounded-full bg-neon-pink-500 px-6 py-3 text-sm font-extrabold tracking-wide text-ink-950 uppercase shadow-neon-pink transition hover:-translate-y-0.5 hover:bg-neon-pink-400"
                            >
                                {t('hero.book')}
                            </a>
                            {/* Mockato: progetto dimostrativo, il pulsante non avvia una chiamata reale. */}
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-0.5 hover:bg-white/10"
                            >
                                <Phone className="size-4" />
                                {t('hero.call')}
                            </button>
                        </div>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <div className="relative mx-auto grid size-72 place-items-center rounded-full bg-linear-to-br from-neon-pink-500/30 to-neon-cyan-500/30 shadow-neon-pink ring-1 ring-white/10 sm:size-96">
                            {/* Il logo ha il fondo nero: con mix-blend-screen il nero sparisce e sul cerchio
                                restano solo le linee al neon. */}
                            <img src={logo} alt="Bottega del Taglio" className="size-40 mix-blend-screen sm:size-56" />
                        </div>
                    </Reveal>
                </div>
            </section>

            <div className="overflow-hidden border-y border-white/10 bg-ink-900 py-4">
                <div className="motion-safe:animate-marquee flex w-max gap-10 whitespace-nowrap">
                    {[...marqueeWords, ...marqueeWords].map((word, i) => (
                        <span
                            key={`${word}-${i}`}
                            className="font-display text-2xl font-extrabold tracking-wide text-white/15 uppercase"
                        >
                            {word} <span className="text-neon-pink-500">•</span>
                        </span>
                    ))}
                </div>
            </div>

            <section id="servizi" className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold">{t('services.title')}</h2>
                        <p className="mt-3 max-w-xl text-white/60">
                            {t('services.intro')}
                        </p>
                    </Reveal>

                    <div className="mt-12 grid gap-6 sm:grid-cols-3">
                        {SERVICES.map((s, i) => (
                            <Reveal key={s.slug} delay={(i % 3) * 0.08}>
                                <div className="h-full rounded-2xl border border-white/10 bg-ink-800 p-6">
                                    <div className="grid size-11 place-items-center rounded-xl bg-neon-cyan-500/10 text-neon-cyan-400">
                                        <s.icon className="size-5" />
                                    </div>
                                    <h3 className="mt-4 text-base font-extrabold">{t(`services.items.${s.slug}.name`)}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                                        {t(`services.items.${s.slug}.desc`)}
                                    </p>
                                    <p className="mt-4 text-2xl font-extrabold text-neon-yellow-400">
                                        {formatPrice(s.price, locale)}
                                    </p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-ink-900 px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
                    <Reveal>
                        {/* Insegna al neon con gli orari, al posto di una foto della bottega. */}
                        <div className="neon-lines grid place-items-center rounded-3xl border-2 border-neon-pink-500/70 bg-ink-950 px-6 py-12 text-center shadow-neon-pink lg:aspect-4/3 lg:py-0">
                            <div>
                                <p className="text-xs font-bold tracking-[0.3em] text-neon-cyan-400 uppercase">
                                    {t('hours.title')}
                                </p>
                                <p className="neon-glow mt-4 font-display text-5xl font-extrabold text-white uppercase sm:text-6xl">
                                    {hours.days}
                                </p>
                                <p className="mt-5 font-display text-2xl font-extrabold text-neon-yellow-400 tabular-nums [text-shadow:0_0_16px_rgb(230_255_26/0.55)] sm:text-3xl">
                                    {hours.ranges.map((range) => (
                                        <span key={range} className="block">
                                            {range}
                                        </span>
                                    ))}
                                </p>
                                <p className="mt-5 text-sm font-bold tracking-wide text-white/60 uppercase">
                                    {t('hours.closed', { day: hours.closedDay })}
                                </p>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <h2 className="text-3xl font-extrabold">{t('about.title')}</h2>
                        <p className="mt-4 leading-relaxed text-white/70">
                            {t('about.text')}
                        </p>
                    </Reveal>
                </div>
            </section>

            <section id="prenota" className="px-4 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-3xl">
                    <Reveal>
                        <h2 className="text-3xl font-extrabold">{t('booking.title')}</h2>
                        <p className="mt-3 text-white/60">
                            {t('booking.intro')}
                        </p>
                    </Reveal>

                    <Reveal delay={0.08} className="mt-8 block">
                        <BookingForm />
                    </Reveal>
                </div>
            </section>
        </>
    )
}
