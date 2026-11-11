import { CheckCircle2 } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Booking } from '../api/booking'
import { fetchBookedSlots, SlotTakenError, submitBooking } from '../api/booking'
import { useLocale } from '../i18n/useLocale'
import { describeDay, formatSlot, getBookableDays, SLOTS } from '../data/booking'
import { formatPrice, SERVICES } from '../data/services'

type SubmitError = 'slotTaken' | 'generic' | null

export function BookingForm() {
    const { t } = useTranslation()
    const { locale } = useLocale()
    const days = useMemo(() => getBookableDays(), [])

    const [service, setService] = useState(SERVICES[0].slug)
    const [day, setDay] = useState(days[0])
    const [slot, setSlot] = useState(SLOTS[0])
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [sending, setSending] = useState(false)
    const [confirmed, setConfirmed] = useState<Booking | null>(null)
    const [error, setError] = useState<SubmitError>(null)

    // Orari occupati del giorno scelto. `version` forza una nuova lettura dopo ogni prenotazione.
    const [booked, setBooked] = useState<{ day: string; version: number; slots: number[] } | null>(null)
    const [version, setVersion] = useState(0)

    useEffect(() => {
        let cancelled = false
        fetchBookedSlots(day).then((slots) => {
            if (!cancelled) setBooked({ day, version, slots })
        })
        return () => {
            cancelled = true
        }
    }, [day, version])

    const loadingSlots = booked?.day !== day || booked.version !== version
    const bookedSlots = loadingSlots ? [] : booked.slots
    const freeSlots = loadingSlots ? [] : SLOTS.filter((m) => !bookedSlots.includes(m))
    // Se l'orario scelto risulta occupato, si passa al primo libero del giorno.
    const selectedSlot: number | undefined = freeSlots.includes(slot) ? slot : freeSlots[0]

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (sending || selectedSlot === undefined) return
        setSending(true)
        setError(null)
        try {
            // Chiamata mockata (api/booking.ts): nessun dato lascia il browser.
            const booking = await submitBooking({ service, day, slot: selectedSlot, name, phone })
            setConfirmed(booking)
        } catch (err) {
            setError(err instanceof SlotTakenError ? 'slotTaken' : 'generic')
        } finally {
            setSending(false)
            setVersion((v) => v + 1)
        }
    }

    if (confirmed) {
        const bookedService = SERVICES.find((s) => s.slug === confirmed.service) ?? SERVICES[0]
        return (
            <div className="rounded-3xl border border-neon-cyan-400/30 bg-ink-800 p-8 text-center shadow-neon-cyan">
                <CheckCircle2 className="mx-auto size-10 text-neon-cyan-400" />
                <h3 className="mt-4 text-xl font-extrabold text-white">{t('booking.doneTitle')}</h3>
                <p className="mt-3 inline-block rounded-full bg-neon-pink-500/15 px-4 py-1.5 text-sm font-semibold text-neon-pink-400">
                    {t(`services.items.${bookedService.slug}.name`)} · {formatPrice(bookedService.price, locale)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {t('booking.doneText', {
                        date: describeDay(confirmed.day, locale).full,
                        time: formatSlot(confirmed.slot),
                    })}
                </p>
                <button
                    type="button"
                    onClick={() => setConfirmed(null)}
                    className="mt-6 rounded-full bg-ink-700 px-6 py-3 text-sm font-extrabold tracking-wide text-white uppercase transition hover:bg-ink-700/70"
                >
                    {t('booking.another')}
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-ink-800 p-6 sm:p-8">
            <div>
                <p className="text-xs font-bold tracking-wide text-white/50 uppercase">{t('booking.service')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {SERVICES.map((s) => (
                        <button
                            key={s.slug}
                            type="button"
                            aria-pressed={service === s.slug}
                            onClick={() => setService(s.slug)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                service === s.slug
                                    ? 'bg-neon-pink-500 text-ink-950 shadow-neon-pink'
                                    : 'bg-ink-700 text-white/80 hover:bg-ink-700/70'
                            }`}
                        >
                            {t(`services.items.${s.slug}.name`)} · {formatPrice(s.price, locale)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <p className="text-xs font-bold tracking-wide text-white/50 uppercase">{t('booking.day')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {days.map((iso) => {
                        const d = describeDay(iso, locale)
                        return (
                            <button
                                key={iso}
                                type="button"
                                aria-pressed={day === iso}
                                onClick={() => {
                                    setDay(iso)
                                    setError(null)
                                }}
                                className={`min-w-15 rounded-xl px-3 py-2 text-center text-sm font-semibold transition ${
                                    day === iso
                                        ? 'bg-neon-yellow-500 text-ink-950 shadow-neon-yellow'
                                        : 'bg-ink-700 text-white/80 hover:bg-ink-700/70'
                                }`}
                            >
                                <span className="block text-[10px] uppercase opacity-80">
                                    {d.weekday}
                                </span>
                                {d.day} {d.month}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="mt-6">
                <p className="text-xs font-bold tracking-wide text-white/50 uppercase">{t('booking.slot')}</p>
                <div className="mt-3 flex flex-wrap gap-2" aria-busy={loadingSlots}>
                    {SLOTS.map((m) => {
                        const taken = bookedSlots.includes(m)
                        const selected = m === selectedSlot
                        return (
                            <button
                                key={m}
                                type="button"
                                disabled={loadingSlots || taken}
                                aria-pressed={selected}
                                title={taken ? t('booking.taken') : undefined}
                                onClick={() => {
                                    setSlot(m)
                                    setError(null)
                                }}
                                className={`rounded-full px-3.5 py-2 text-sm font-semibold tabular-nums transition ${
                                    taken
                                        ? 'cursor-not-allowed bg-ink-700/40 text-white/30 line-through'
                                        : selected
                                          ? 'bg-neon-cyan-500 text-ink-950 shadow-neon-cyan'
                                          : 'bg-ink-700 text-white/80 enabled:hover:bg-ink-700/70'
                                } ${loadingSlots ? 'animate-pulse cursor-wait' : ''}`}
                            >
                                {formatSlot(m)}
                                {taken && <span className="sr-only"> — {t('booking.taken')}</span>}
                            </button>
                        )
                    })}
                </div>
                {!loadingSlots && freeSlots.length === 0 && (
                    <p className="mt-3 text-sm text-neon-yellow-400">{t('booking.noSlots')}</p>
                )}
                {!loadingSlots && bookedSlots.length > 0 && freeSlots.length > 0 && (
                    <p className="mt-3 text-xs text-white/50">{t('booking.takenHint')}</p>
                )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block">
                    <span className="text-xs font-bold tracking-wide text-white/50 uppercase">
                        {t('booking.name')}
                    </span>
                    <input
                        required
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-neon-cyan-400 focus:outline-none"
                        placeholder={t('booking.namePlaceholder')}
                    />
                </label>
                <label className="block">
                    <span className="text-xs font-bold tracking-wide text-white/50 uppercase">
                        {t('booking.phone')}
                    </span>
                    <input
                        required
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        pattern="\+?[0-9 ]{6,20}"
                        title={t('booking.phoneHint')}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-neon-cyan-400 focus:outline-none"
                        placeholder={t('booking.phonePlaceholder')}
                    />
                </label>
            </div>

            {error && (
                <p role="alert" className="mt-6 rounded-xl bg-neon-pink-500/10 px-4 py-3 text-sm text-neon-pink-400">
                    {t(error === 'slotTaken' ? 'booking.slotTaken' : 'booking.error')}
                </p>
            )}

            <button
                type="submit"
                disabled={sending || selectedSlot === undefined}
                className="mt-8 w-full rounded-full bg-neon-pink-500 px-6 py-3.5 text-sm font-extrabold tracking-wide text-ink-950 uppercase shadow-neon-pink transition enabled:hover:-translate-y-0.5 enabled:hover:bg-neon-pink-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {sending ? t('booking.sending') : t('booking.submit')}
            </button>
        </form>
    )
}
