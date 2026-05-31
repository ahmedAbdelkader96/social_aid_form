import type CountryModel from '../models/CountryModel'

export type CountryLocale = 'en' | 'ar'

export const getCountryLocale = (language: string): CountryLocale =>
  language.startsWith('ar') ? 'ar' : 'en'

export const getCountryLocaleName = (entry: CountryModel | null | undefined, locale: CountryLocale): string => {
  if (!entry) return ''
  return locale === 'ar'
    ? entry.nameAr || entry.nameEn || entry.code
    : entry.nameEn || entry.nameAr || entry.code
}
