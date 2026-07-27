// i18n store + helpers for Gram Panchayat Chandra portal
// §8 of Master Prompt v2.0 — Hindi-first bilingual (hi/en)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Locale = 'hi' | 'en'

interface I18nState {
  locale: Locale
  setLocale: (l: Locale) => void
  toggle: () => void
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'hi', // Hindi-first per §8.1
      setLocale: (l) => set({ locale: l }),
      toggle: () => set({ locale: get().locale === 'hi' ? 'en' : 'hi' }),
    }),
    { name: 'gpchandra-locale' }
  )
)

// Server-side default locale (for SSR)
export const DEFAULT_LOCALE: Locale = 'hi'

// Helper for picking a localized string
export function t(hi: string, en: string, locale: Locale): string {
  return locale === 'hi' ? hi : en
}
