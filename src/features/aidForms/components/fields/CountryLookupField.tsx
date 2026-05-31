import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWatch } from 'react-hook-form'
import type { FC, ChangeEvent } from 'react'
import type CountryModel from '../../../countries/models/CountryModel'
import type { Step1FieldProps } from '../../types/formFieldTypes'
import { AID_FORM_FIELD } from '../../types/aidFormTypes'
import { enhanceRegisterEvent } from '../../utils/rhfHelpers'
import CountryOptionList from '../../../countries/components/CountryOptionList'
import { getCountryLocale, getCountryLocaleName } from '../../../countries/utils/countryLocale'
import { FieldWrapper } from './FieldWrapper'
import styles from '../../styles/AidForm.module.css'

interface CountryLookupFieldProps extends Step1FieldProps {
  options: CountryModel[]
  loading: boolean
  delayIndex: number
}

export const CountryLookupField: FC<CountryLookupFieldProps> = ({
  register,
  control,
  setValue,
  trigger,
  errors,
  clearErrors,
  dismissToast,
  options,
  loading,
  delayIndex,
}) => {
  const { t, i18n } = useTranslation()
  const locale = useMemo(() => getCountryLocale(i18n.language), [i18n.language])
  const getLocaleName = useCallback(
    (entry: CountryModel | null | undefined) => getCountryLocaleName(entry, locale),
    [locale],
  )

  const [countryQuery, setCountryQuery] = useState('')
  const [countryOpen, setCountryOpen] = useState(false)
  const countryRef = useRef<HTMLDivElement>(null)

  const countryCode = useWatch({ control, name: AID_FORM_FIELD.countryCode })
  const selectedCountry = useMemo(() => {
    if (!countryCode || options.length === 0) return null
    return options.find((entry) => entry.code === countryCode) ?? null
  }, [countryCode, options])

  const filteredCountryOptions = useMemo(() => {
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
  }

  const validateCountryBlur = async () => {
    const q = (countryQuery || '').trim()
    if (q) {
      const matched = options.find((entry) => getLocaleName(entry).toLowerCase() === q.toLowerCase())
      if (matched) {
        selectCountry(matched)
      } else {
        setValue(AID_FORM_FIELD.countryCode, '', { shouldValidate: true, shouldDirty: true })
        if (clearErrors) clearErrors(AID_FORM_FIELD.countryCode)
      }
    }

    if (trigger) await trigger(AID_FORM_FIELD.countryCode)
  }

  const selectCountry = (entry: CountryModel) => {
    setCountryQuery(getLocaleName(entry))
    setValue(AID_FORM_FIELD.countryCode, entry.code, { shouldValidate: true, shouldDirty: true })
    if (clearErrors) clearErrors(AID_FORM_FIELD.countryCode)
    setCountryOpen(false)
  }

  return (
    <FieldWrapper label={t('country')} delayIndex={delayIndex}>
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

        <input
          type="hidden"
          {...enhanceRegisterEvent(
            register(AID_FORM_FIELD.countryCode, { required: true }),
            AID_FORM_FIELD.countryCode,
            trigger,
            clearErrors,
            dismissToast ?? undefined,
          )}
        />

        {countryOpen && (
          <CountryOptionList
            options={filteredCountryOptions}
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
