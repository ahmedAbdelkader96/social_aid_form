import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { FC, ChangeEvent } from 'react'
import type { FieldErrors, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormClearErrors, UseFormTrigger } from 'react-hook-form'
import type CountryModel from '../../../countries/models/CountryModel'
import type { AidFormValues } from '../../types/aidFormTypes'
import { AID_FORM_FIELD } from '../../types/aidFormTypes'
import CountryOptionList from '../../../countries/components/CountryOptionList'
import { FieldWrapper } from './FieldWrapper'
import styles from '../../styles/AidForm.module.css'

interface CountryLookupFieldProps {
  register: UseFormRegister<AidFormValues>
  getValues: UseFormGetValues<AidFormValues>
  setValue: UseFormSetValue<AidFormValues>
  trigger?: UseFormTrigger<AidFormValues>
  errors: FieldErrors<AidFormValues>
  clearErrors?: UseFormClearErrors<AidFormValues>
  options: CountryModel[]
  loading: boolean
  delayIndex: number
}

export const CountryLookupField: FC<CountryLookupFieldProps> = ({
  register,
  getValues,
  setValue,
  trigger,
  errors,
  clearErrors,
  options,
  loading,
  delayIndex,
}) => {
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en'
  const getLocaleName = useCallback(
    (entry: CountryModel | null | undefined) => {
      if (!entry) return ''
      return locale === 'ar' ? entry.nameAr || entry.nameEn || entry.code : entry.nameEn || entry.nameAr || entry.code
    },
    [locale],
  )

  const [countryQuery, setCountryQuery] = useState('')
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryModel | null>(null)
  const countryRef = useRef<HTMLDivElement>(null)

  const filteredCountryOptions = useCallback(() => {
    const q = (countryQuery || '').trim().toLowerCase()
    if (!q) return options
    return options.filter((entry) => {
      const name = getLocaleName(entry).toLowerCase()
      return (
        name.includes(q) ||
        (entry.code && entry.code.toLowerCase().includes(q)) ||
        (entry.dialCode && entry.dialCode.includes(q))
      )
    })
  }, [countryQuery, options, getLocaleName])

  useEffect(() => {
    const values = getValues()
    if (values.countryCode && options.length > 0) {
      const found = options.find((entry) => entry.code === values.countryCode)
      if (found) {
        setSelectedCountry(found)
        setCountryQuery(getLocaleName(found))
      }
    }
  }, [getValues, getLocaleName, options])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCountryQuery(event.target.value)
    setCountryOpen(true)
    setValue(AID_FORM_FIELD.countryCode, '', { shouldValidate: true, shouldDirty: true })
    if (clearErrors) clearErrors(AID_FORM_FIELD.countryCode)
    if (selectedCountry && getLocaleName(selectedCountry) !== event.target.value) {
      setSelectedCountry(null)
    }
  }

  const validateCountryBlur = async () => {
    if (trigger) await trigger(AID_FORM_FIELD.countryCode)
  }

  const selectCountry = (entry: CountryModel) => {
    setCountryQuery(getLocaleName(entry))
    setSelectedCountry(entry)
    setValue(AID_FORM_FIELD.countryCode, entry.code, { shouldValidate: true, shouldDirty: true })
    if (clearErrors) clearErrors(AID_FORM_FIELD.countryCode)
    setCountryOpen(false)
  }

  const countryError = errors.countryCode ? t('fieldRequired', { field: t('country') }) : undefined

  return (
    <FieldWrapper label={t('country')} delayIndex={delayIndex} error={countryError}>
      <div className={styles.countryInputWrapper} ref={countryRef}>
        <input
          type="text"
          value={countryQuery || (selectedCountry ? getLocaleName(selectedCountry) : '')}
          onChange={handleCountryChange}
          onFocus={() => setCountryOpen(true)}
          onBlur={validateCountryBlur}
          className={styles.countrySearchInput}
          aria-invalid={!!errors.countryCode}
          placeholder={t('countryLookupPlaceholder')}
          autoComplete="off"
          disabled={loading}
        />

        {selectedCountry?.flagUrl && (
          <img src={selectedCountry.flagUrl} alt={getLocaleName(selectedCountry)} className={styles.selectedFlagImage} />
        )}

        <input type="hidden" {...register(AID_FORM_FIELD.countryCode)} />

        {countryOpen && (
          <CountryOptionList
            options={filteredCountryOptions()}
            loading={loading}
            noResultsText={t('noCountries')}
            ulClassName={styles.suggestionList}
            itemClassName={styles.suggestionItem}
            flagClassName={styles.suggestionFlagImage}
            primaryClassName={styles.countryItemPrimary}
            onSelect={selectCountry}
            getLocaleName={getLocaleName}
          />
        )}
      </div>
    </FieldWrapper>
  )
}
