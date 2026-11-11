// API di prenotazione mockata: il progetto non ha un backend.
// Le prenotazioni restano nel localStorage del browser di chi visita il sito (o in memoria, se il
// localStorage non è disponibile): nessun dato lascia il browser. Ogni chiamata attende un attimo
// per simulare la rete. Oltre a quelle del visitatore, ogni giorno ha alcuni orari già occupati
// da "altri clienti", scelti in modo pseudocasuale ma sempre uguale per lo stesso giorno.

import { SLOTS } from '../data/booking'

export interface BookingRequest {
    service: string
    /** Giorno `YYYY-MM-DD`. */
    day: string
    /** Minuti dalla mezzanotte (es. 540 = 09:00). */
    slot: number
    name: string
    phone: string
}

export interface Booking extends BookingRequest {
    id: string
}

/** Errore restituito quando l'orario scelto è stato occupato nel frattempo (es. da un'altra scheda). */
export class SlotTakenError extends Error {
    constructor() {
        super('slot-taken')
        this.name = 'SlotTakenError'
    }
}

const STORAGE_KEY = 'bottega-del-taglio:bookings'
const MOCK_LATENCY_MS = 500

let memoryStore: Booking[] = []

function readAll(): Booking[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as Booking[]) : memoryStore
    } catch {
        return memoryStore
    }
}

function writeAll(bookings: Booking[]) {
    memoryStore = bookings
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
    } catch {
        // localStorage non disponibile (navigazione privata, storage bloccato): resta in memoria.
    }
}

/** Generatore pseudocasuale (mulberry32) con un seme ricavato dal giorno: stessi orari a ogni visita. */
function seededRandom(seedText: string) {
    let seed = 0
    for (const char of seedText) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) | 0
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/** Orari occupati da clienti simulati: da 3 a 6 al giorno, qualcuno in più il sabato. */
function simulatedBookedSlots(day: string): number[] {
    const random = seededRandom(day)
    const isSaturday = new Date(`${day}T12:00:00Z`).getUTCDay() === 6
    const count = 3 + Math.floor(random() * 4) + (isSaturday ? 3 : 0)
    const pool = [...SLOTS]
    const taken: number[] = []
    while (taken.length < count && pool.length > 0) {
        taken.push(...pool.splice(Math.floor(random() * pool.length), 1))
    }
    return taken
}

function bookedSlotsOf(day: string): number[] {
    const own = readAll().filter((b) => b.day === day).map((b) => b.slot)
    return [...simulatedBookedSlots(day), ...own]
}

const delay = <T>(value: () => T) =>
    new Promise<T>((resolve, reject) =>
        setTimeout(() => {
            try {
                resolve(value())
            } catch (error) {
                reject(error)
            }
        }, MOCK_LATENCY_MS),
    )

/** Orari già prenotati in un giorno, in minuti dalla mezzanotte. */
export function fetchBookedSlots(day: string): Promise<number[]> {
    return delay(() => bookedSlotsOf(day))
}

/** Registra la prenotazione; fallisce con `SlotTakenError` se l'orario è già occupato. */
export function submitBooking(request: BookingRequest): Promise<Booking> {
    return delay(() => {
        if (bookedSlotsOf(request.day).includes(request.slot)) throw new SlotTakenError()
        const bookings = readAll()
        const booking: Booking = { ...request, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }
        writeAll([...bookings, booking])
        return booking
    })
}
