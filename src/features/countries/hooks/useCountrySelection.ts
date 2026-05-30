// Country selection hooks.
// Encapsulates reusable country picker state and interactions.

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChangeEvent, Dispatch, RefObject, SetStateAction } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchCountriesAsync } from '../stores'
import type CountryModel from '../models/CountryModel'
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form'

export interface CountrySelectionFormFields {
  countryCode: string
  dialCode: string
}

export interface CountrySelectionHook {
  countryQuery: string
  setCountryQuery: Dispatch<SetStateAction<string>>
  countryOpen: boolean
  setCountryOpen: Dispatch<SetStateAction<boolean>>
  selectedCountry: CountryModel | null
  selectedDial: CountryModel | null
  dialQuery: string
  setDialQuery: Dispatch<SetStateAction<string>>
  dialOpen: boolean
  setDialOpen: Dispatch<SetStateAction<boolean>>
  filteredCountries: CountryModel[]
  filteredDialOptions: CountryModel[]
  loading: boolean
  countryRef: RefObject<HTMLDivElement>
  dialRef: RefObject<HTMLDivElement>
  getDisplayName: (entry: CountryModel | null | undefined) => string
  getLocaleName: (entry: CountryModel | null | undefined) => string
  selectCountry: (entry: CountryModel) => void
  selectDialCode: (entry: CountryModel) => void
  handleCountryChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function useCountrySelection(
  getValues: UseFormGetValues<any>,
  setValue: UseFormSetValue<any>,
) {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const countriesState = useAppSelector((state) => state.countries)
  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en'

  const countryOptions = countriesState.items
  const dialCodeOptions = countriesState.items
  const loading = countriesState.status === 'loading'

  const [countryQuery, setCountryQuery] = useState('')
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryModel | null>(null)
  const [dialQuery, setDialQuery] = useState('')
  const [dialOpen, setDialOpen] = useState(false)
  const [selectedDial, setSelectedDial] = useState<CountryModel | null>(null)

  const countryRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchCountriesAsync())
  }, [dispatch])

  const getDisplayName = (entry: CountryModel | null | undefined) => {
    if (!entry) return ''
    const primary = locale === 'ar' ? entry.nameAr : entry.nameEn
    const fallback = locale === 'ar' ? entry.nameEn : entry.nameAr
    if (primary && primary.trim()) return primary
    if (fallback && fallback.trim()) return fallback
    if (entry.nameEn && entry.nameEn.trim()) return entry.nameEn
    if (entry.nameAr && entry.nameAr.trim()) return entry.nameAr
    return entry.code ?? ''
  }

  const getLocaleName = (entry: CountryModel | null | undefined) => {
    if (!entry) return ''
    return locale === 'ar' ? entry.nameAr || entry.nameEn || entry.code : entry.nameEn || entry.nameAr || entry.code
  }

  useEffect(() => {
    const initializeSelections = () => {
      const values = getValues()
      if (values.countryCode && countryOptions.length > 0) {
        const foundCountry = countryOptions.find((entry) => entry.code === values.countryCode)
        if (foundCountry) {
          setCountryQuery(getLocaleName(foundCountry))
          setSelectedCountry(foundCountry)
        }
      }
      if (values.dialCode && dialCodeOptions.length > 0) {
        const foundDial = dialCodeOptions.find((entry) => entry.dialCode === values.dialCode)
        if (foundDial) setSelectedDial(foundDial)
      }
    }

    if (countryOptions.length > 0 || dialCodeOptions.length > 0) {
      initializeSelections()
    }
  }, [countryOptions, dialCodeOptions, getValues, locale])

  useEffect(() => {
    if (selectedCountry) setCountryQuery(getLocaleName(selectedCountry))
  }, [selectedCountry, locale])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) setCountryOpen(false)
      if (dialRef.current && !dialRef.current.contains(event.target as Node)) setDialOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase()
    return countryOptions.filter((option) => {
      const display = getDisplayName(option)
      const other = locale === 'ar' ? option.nameEn ?? '' : option.nameAr ?? ''
      return (
        (typeof display === 'string' && display.toLowerCase().includes(query)) ||
        (typeof other === 'string' && other.toLowerCase().includes(query)) ||
        option.code.toLowerCase().includes(query) ||
        option.dialCode.toLowerCase().includes(query)
      )
    })
  }, [countryOptions, countryQuery, locale])

  const filteredDialOptions = useMemo(() => {
    const query = dialQuery.trim().toLowerCase()
    return dialCodeOptions.filter((option) => {
      const nameEn = option.nameEn?.toLowerCase() ?? ''
      const nameAr = option.nameAr?.toLowerCase() ?? ''
      const code = option.code.toLowerCase()
      const dialCode = option.dialCode.toLowerCase()
      return nameEn.includes(query) || nameAr.includes(query) || code.includes(query) || dialCode.includes(query)
    })
  }, [dialCodeOptions, dialQuery])

  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCountryQuery(event.target.value)
    setCountryOpen(true)
    setValue('countryCode', '', { shouldValidate: true, shouldDirty: true })
    if (selectedCountry && getLocaleName(selectedCountry) !== event.target.value) setSelectedCountry(null)
  }

  const selectCountry = (entry: CountryModel) => {
    setCountryQuery(getLocaleName(entry))
    setSelectedCountry(entry)
    setValue('countryCode', entry.code, { shouldValidate: true, shouldDirty: true })
    setCountryOpen(false)
  }

  const selectDialCode = (entry: CountryModel) => {
    setSelectedDial(entry)
    setValue('dialCode', entry.dialCode, { shouldValidate: true, shouldDirty: true })
    setDialOpen(false)
  }

  return {
    countryQuery,
    setCountryQuery,
    countryOpen,
    setCountryOpen,
    selectedCountry,
    selectedDial,
    dialQuery,
    setDialQuery,
    dialOpen,
    setDialOpen,
    filteredCountries,
    filteredDialOptions,
    loading,
    countryRef,
    dialRef,
    getDisplayName,
    getLocaleName,
    selectCountry,
    selectDialCode,
    handleCountryChange,
  }
}
