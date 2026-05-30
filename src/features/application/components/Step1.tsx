// First form step for personal details, country selection, and phone input.
import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ChangeEvent, FC, PropsWithChildren } from 'react'
import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form'
import type { ApplicationFormValues } from '../models/applicationTypes'

import CountryModel from '../../countries/models/CountryModel'
import { fetchCountriesAsync } from '../../countries/stores'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import styles from '../styles/ApplicationForm.module.css'

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: 'easeOut',
      delay: custom * 0.05,
    },
  }),
}

const AnimatedFieldLabel: FC<PropsWithChildren<{ delayIndex: number }>> = ({ delayIndex, children }) => (
  <motion.label
    className={styles.fieldLabel}
    variants={fieldVariants}
    custom={delayIndex}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.label>
)

interface Step1Props {
  register: UseFormRegister<ApplicationFormValues>
  setValue: UseFormSetValue<ApplicationFormValues>
  getValues: UseFormGetValues<ApplicationFormValues>
  errors: FieldErrors<ApplicationFormValues>
}

export const Step1: FC<Step1Props> = ({ register, setValue, getValues, errors }) => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const countriesState = useAppSelector((state) => state.countries)
  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en'

  const countryOptions = countriesState.items
  const dialCodeOptions = countriesState.items
  const loading = countriesState.status === 'loading'

  useEffect(() => {
    dispatch(fetchCountriesAsync())
  }, [dispatch])

  const [countryQuery, setCountryQuery] = useState('')
  const [countryOpen, setCountryOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<CountryModel | null>(null)

  const [dialQuery, setDialQuery] = useState('')
  const [dialOpen, setDialOpen] = useState(false)
  const [selectedDial, setSelectedDial] = useState<CountryModel | null>(null)

  const countryRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)

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
    return locale === 'ar' ? (entry.nameAr || entry.nameEn || entry.code) : (entry.nameEn || entry.nameAr || entry.code)
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

    if (countryOptions.length > 0 || dialCodeOptions.length > 0) initializeSelections()
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

  const countryField = register('countryCode', { required: true })
  const dialField = register('dialCode', { required: true })

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

  return (
    <motion.div className={styles.stepGrid}>
      <AnimatedFieldLabel delayIndex={0}>
        {t('name')}
        <input {...register('name', { required: true })} className={styles.fieldInput} aria-invalid={!!errors.name} />
        {errors.name && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={1}>
        {t('nationalId')}
        <input
          {...register('nationalId', {
            required: true,
            pattern: { value: /^\d+$/, message: t('invalidNationalId') },
          })}
          className={styles.fieldInput}
          aria-invalid={!!errors.nationalId}
          inputMode="numeric"
          placeholder="123456789"
        />
        {errors.nationalId?.type === 'required' && <span className={styles.errorText}>{t('required')}</span>}
        {errors.nationalId?.type === 'pattern' && <span className={styles.errorText}>{errors.nationalId.message}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={2}>
        {t('dob')}
        <input
          type="date"
          {...register('dateOfBirth', { required: true })}
          className={styles.fieldInput}
          aria-invalid={!!errors.dateOfBirth}
        />
        {errors.dateOfBirth && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={3}>
        {t('gender')}
        <select {...register('gender', { required: true })} className={styles.fieldInput} aria-invalid={!!errors.gender}>
          <option value="">{t('selectGender')}</option>
          <option value="female">{t('female')}</option>
          <option value="male">{t('male')}</option>
          <option value="other">{t('other')}</option>
        </select>
        {errors.gender && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={4}>
        {t('address')}
        <input {...register('address', { required: true })} className={styles.fieldInput} aria-invalid={!!errors.address} />
        {errors.address && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={5}>
        {t('city')}
        <input {...register('city', { required: true })} className={styles.fieldInput} aria-invalid={!!errors.city} />
        {errors.city && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={6}>
        {t('state')}
        <input {...register('state', { required: true })} className={styles.fieldInput} aria-invalid={!!errors.state} />
        {errors.state && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={7}>
        {t('country')}
        <div className={styles.countryInputWrapper} ref={countryRef}>
          <input
            type="text"
            value={countryQuery || (selectedCountry ? getLocaleName(selectedCountry) : '')}
            onChange={handleCountryChange}
            onFocus={() => setCountryOpen(true)}
            className={styles.countrySearchInput}
            aria-invalid={!!errors.countryCode}
            placeholder={t('countryLookupPlaceholder')}
            autoComplete="off"
            disabled={loading}
          />
          {selectedCountry?.flagUrl && (
            <img src={selectedCountry.flagUrl} alt={getLocaleName(selectedCountry)} className={styles.selectedFlagImage} />
          )}
          <input type="hidden" {...countryField} />
          {countryOpen && (
            <ul className={styles.suggestionList} role="listbox">
              {loading ? (
                <li className={styles.noResultsItem}>{t('loading')}</li>
              ) : filteredCountries.length > 0 ? (
                filteredCountries.map((entry) => (
                  <li key={entry.code} className={styles.suggestionItem} onMouseDown={() => selectCountry(entry)} role="option">
                    {entry.flagUrl ? <img src={entry.flagUrl} alt={getLocaleName(entry)} className={styles.suggestionFlagImage} /> : <span className={styles.flagEmoji}>🌍</span>}
                    <div className={styles.countryItemText}>
                      <span className={styles.countryItemPrimary}>{getLocaleName(entry)}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className={styles.noResultsItem}>{t('noCountries')}</li>
              )}
            </ul>
          )}
        </div>
        {errors.countryCode && <span className={styles.errorText}>{t('required')}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={8}>
        {t('phone')}
        <div className={styles.phoneInputGroup}>
          <div className={styles.dialPicker} ref={dialRef}>
            <button type="button" className={styles.dialButton} onClick={() => setDialOpen((o) => !o)} aria-expanded={dialOpen} disabled={loading}>
              <div className={styles.dialButtonRow}>
                {selectedDial?.flagUrl ? <img src={selectedDial.flagUrl} alt={selectedDial.dialCode} className={styles.dialFlagImage} /> : <span className={styles.flagEmoji}>🌐</span>}
                <span className={styles.dialButtonLabel}>{selectedDial ? selectedDial.dialCode : t('selectCountry')}</span>
              </div>
            </button>
            <input type="hidden" {...dialField} />
            {dialOpen && (
              <div className={styles.dialDropdown}>
                <input type="search" value={dialQuery} onChange={(e) => setDialQuery(e.target.value)} className={styles.dialSearchInput} placeholder={t('searchCountry')} />
                <ul className={styles.dialList} role="listbox">
                  {filteredDialOptions.length > 0 ? (
                    filteredDialOptions.map((entry) => (
                      <li key={`${entry.dialCode}-${entry.code}`} className={styles.dialListItem} onMouseDown={() => selectDialCode(entry)} role="option">
                        {entry.flagUrl ? <img src={entry.flagUrl} alt={entry.dialCode} className={styles.suggestionFlagImage} /> : <span className={styles.flagEmoji}>🌐</span>}
                        <span className={styles.dialButtonLabel}>{entry.dialCode}</span>
                      </li>
                    ))
                  ) : (
                    <li className={styles.noResultsItem}>{t('noMatches')}</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <input
            {...register('phone', {
              required: true,
              pattern: { value: /^\+?\d[\d\s-]{7,}$/, message: t('invalidPhone') },
            })}
            className={`${styles.fieldInput}`}
            aria-invalid={!!errors.phone}
            placeholder="123 456 7890"
          />
        </div>
        {errors.phone?.type === 'required' && <span className={styles.errorText}>{t('required')}</span>}
        {errors.phone?.type === 'pattern' && <span className={styles.errorText}>{errors.phone.message}</span>}
      </AnimatedFieldLabel>

      <AnimatedFieldLabel delayIndex={9}>
        {t('email')}
        <input
          type="email"
          {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          className={styles.fieldInput}
          aria-invalid={!!errors.email}
        />
        {errors.email?.type === 'required' && <span className={styles.errorText}>{t('required')}</span>}
        {errors.email?.type === 'pattern' && <span className={styles.errorText}>{t('invalidEmail')}</span>}
      </AnimatedFieldLabel>
    </motion.div>
  )
}

export default Step1
