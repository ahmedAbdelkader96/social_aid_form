// Application UI component.
// This folder contains reusable components for the application form feature.
// First form step for personal details, country selection, and phone input.

import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form'
import type { ApplicationFormValues } from '../models/applicationTypes'

import { AnimatedFieldLabel } from '../../../shared/components/AnimatedFieldLabel'
import { useCountrySelection } from '../../countries/hooks'
import styles from '../styles/ApplicationForm.module.css'

interface Step1Props {
  register: UseFormRegister<ApplicationFormValues>
  setValue: UseFormSetValue<ApplicationFormValues>
  getValues: UseFormGetValues<ApplicationFormValues>
  errors: FieldErrors<ApplicationFormValues>
}

export const Step1: FC<Step1Props> = ({ register, setValue, getValues, errors }) => {
  const { t } = useTranslation()
  const {
    countryQuery,
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
    getLocaleName,
    selectCountry,
    selectDialCode,
    handleCountryChange,
  } = useCountrySelection(getValues, setValue)

  const countryField = register('countryCode', { required: true })
  const dialField = register('dialCode', { required: true })

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
