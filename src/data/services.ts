import { Scissors, Sparkles, UserRound } from 'lucide-react'
import type { ComponentType } from 'react'

export interface Service {
    slug: string
    price: number
    icon: ComponentType<{ className?: string }>
}

/** Nome e descrizione stanno in locales/*.json, alla chiave `services.items.<slug>`. */
export const SERVICES: Service[] = [
    {
        slug: 'capelli',
        price: 12,
        icon: Scissors,
    },
    {
        slug: 'barba-capelli',
        price: 18,
        icon: Sparkles,
    },
    {
        slug: 'barba',
        price: 8,
        icon: UserRound,
    },
]

/** Prezzo in euro, senza decimali, nel formato della lingua (12 € / €12). */
export const formatPrice = (price: number, locale: string) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price)
