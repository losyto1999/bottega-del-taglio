// Orari della barberia e regole di prenotazione: unica fonte sia per le fasce prenotabili
// sia per gli orari mostrati nell'insegna e nel footer (vedi `describeOpeningHours`).
export const BOOKING = {
    timeZone: 'Europe/Rome',
    /** Finestra di giorni prenotabili, contati da domani. */
    daysAhead: 14,
    /** Giorno di chiusura, come `getUTCDay()` (0 = domenica, 1 = lunedì…). */
    closedWeekday: 1,
    /** Fasce di apertura in minuti dalla mezzanotte: 9:00–13:00 e 15:00–20:00. */
    openingHours: [
        { from: 9 * 60, to: 13 * 60 },
        { from: 15 * 60, to: 20 * 60 },
    ],
    /** Durata di un appuntamento, in minuti. */
    slotMinutes: 30,
} as const

/** Inizio di ogni appuntamento prenotabile, in minuti dalla mezzanotte (9:00, 9:30… 19:30). */
export const SLOTS: number[] = BOOKING.openingHours.flatMap(({ from, to }) => {
    const starts: number[] = []
    for (let m = from; m + BOOKING.slotMinutes <= to; m += BOOKING.slotMinutes) starts.push(m)
    return starts
})

const formatMinutes = (minutes: number, padHours: boolean) => {
    const h = String(Math.floor(minutes / 60))
    const m = String(minutes % 60).padStart(2, '0')
    return `${padHours ? h.padStart(2, '0') : h}:${m}`
}

/** Orario di un appuntamento, con l'ora a due cifre (09:30). */
export const formatSlot = (minutes: number) => formatMinutes(minutes, true)

/**
 * Giorni prenotabili come `YYYY-MM-DD`, a partire da domani.
 * "Domani" si calcola in ora italiana (non in quella del visitatore).
 */
export function getBookableDays(): string[] {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: BOOKING.timeZone }).format(
        new Date(),
    )
    const [year, month, day] = today.split('-').map(Number)

    const days: string[] = []
    for (let offset = 1; offset <= BOOKING.daysAhead; offset++) {
        const date = new Date(Date.UTC(year, month - 1, day + offset, 12))
        if (date.getUTCDay() === BOOKING.closedWeekday) continue
        days.push(date.toISOString().slice(0, 10))
    }
    return days
}

/** Etichette localizzate di un giorno `YYYY-MM-DD`. */
export function describeDay(iso: string, locale: string) {
    const date = new Date(`${iso}T12:00:00Z`)
    const format = (options: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(date)

    return {
        weekday: format({ weekday: 'short' }),
        day: format({ day: 'numeric' }),
        month: format({ month: 'short' }),
        full: format({ weekday: 'long', day: 'numeric', month: 'long' }),
    }
}

const capitalize = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1)

/** Nome localizzato di un giorno della settimana (0 = domenica), con l'iniziale maiuscola. */
function weekdayName(weekday: number, locale: string, width: 'short' | 'long') {
    // 7 gennaio 2024 era una domenica: aggiungendo `weekday` giorni si ottiene il giorno cercato.
    const date = new Date(Date.UTC(2024, 0, 7 + weekday, 12))
    return capitalize(new Intl.DateTimeFormat(locale, { weekday: width, timeZone: 'UTC' }).format(date))
}

/**
 * Orari di apertura pronti da mostrare, ricavati da `BOOKING`:
 * `days` è l'intervallo dei giorni di apertura ("Mar–Dom" / "Tue–Sun"),
 * `ranges` le fasce ("9:00–13:00"), `closedDay` il giorno di chiusura ("Lunedì" / "Monday").
 */
export function describeOpeningHours(locale: string) {
    const firstOpen = (BOOKING.closedWeekday + 1) % 7
    const lastOpen = (BOOKING.closedWeekday + 6) % 7
    return {
        days: `${weekdayName(firstOpen, locale, 'short')}–${weekdayName(lastOpen, locale, 'short')}`,
        ranges: BOOKING.openingHours.map(({ from, to }) => `${formatMinutes(from, false)}–${formatMinutes(to, false)}`),
        closedDay: weekdayName(BOOKING.closedWeekday, locale, 'long'),
    }
}
