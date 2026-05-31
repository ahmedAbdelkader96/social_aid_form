import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { FC, ChangeEvent } from 'react'
import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors,
  UseFormTrigger,
} from 'react-hook-form'
import type CountryModel from '../../../countries/models/CountryModel'
import DialCodeOptionList from '../../../countries/components/DialCodeOptionList'
import { FieldWrapper } from './FieldWrapper'
import type { AidFormValues } from '../../types/aidFormTypes'
import { AID_FORM_FIELD } from '../../types/aidFormTypes'
import { PHONE_PATTERN } from '../../../../shared/constants'
import styles from '../../styles/AidForm.module.css'

interface PhoneDialFieldProps {
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

export const PhoneDialField: FC<PhoneDialFieldProps> = ({
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

  const [dialQuery, setDialQuery] = useState('')
  const [dialOpen, setDialOpen] = useState(false)
  const [selectedDial, setSelectedDial] = useState<CountryModel | null>(null)
  const dialRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const values = getValues()
    if (values.dialCode && options.length > 0) {
      const found = options.find((entry) => entry.dialCode === values.dialCode)
      if (found) setSelectedDial(found)
    }
  }, [getValues, options])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (dialRef.current && !dialRef.current.contains(event.target as Node)) {
        setDialOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredDialOptions = useMemo(() => {
    const q = (dialQuery || '').trim()
    if (!q) return options
    const lq = q.toLowerCase()
    return options.filter((entry) => {
      const name = getLocaleName(entry).toLowerCase()
      return (
        (entry.dialCode && entry.dialCode.includes(q)) ||
        name.includes(lq) ||
        (entry.code && entry.code.toLowerCase().includes(lq))
      )
    })
  }, [dialQuery, options])

  const validateDialBlur = async () => {
    if (trigger) await trigger(AID_FORM_FIELD.dialCode)
  }

  const selectDialCode = (entry: CountryModel) => {
    setSelectedDial(entry)
    setValue(AID_FORM_FIELD.dialCode, entry.dialCode, { shouldValidate: true, shouldDirty: true })
    if (clearErrors) clearErrors(AID_FORM_FIELD.dialCode)
    setDialOpen(false)
  }

  const phoneError =
    errors.phone?.message || (errors.phone || errors.dialCode ? t('fieldRequired', { field: t('phone') }) : undefined)

  return (
    <FieldWrapper label={t('phone')} delayIndex={delayIndex} error={phoneError}>
      <div className={styles.phoneInputGroup}>
        <div className={styles.dialPicker} ref={dialRef}>
          <button
            type="button"
            className={styles.dialButton}
            onClick={() => setDialOpen((open) => !open)}
            aria-expanded={dialOpen}
            disabled={loading}
          >
            <div className={styles.dialButtonRow}>
              {selectedDial?.flagUrl ? (
                <img src={selectedDial.flagUrl} alt={selectedDial.dialCode} className={styles.dialFlagImage} />
              ) : (
                <span className={styles.flagEmoji}>🌐</span>
              )}
              <span className={styles.dialButtonLabel}>{selectedDial ? selectedDial.dialCode : t('selectCountry')}</span>
            </div>
          </button>

          <input type="hidden" {...register(AID_FORM_FIELD.dialCode)} />

          {dialOpen && (
            <div className={styles.dialDropdown}>
              <input
                type="search"
                value={dialQuery}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setDialQuery(event.target.value)}
                onBlur={validateDialBlur}
                className={styles.dialSearchInput}
                placeholder={t('searchCountry')}
              />
              <DialCodeOptionList
                options={filteredDialOptions}
                loading={false}
                noResultsText={t('noMatches')}
                ulClassName={styles.dialList}
                itemClassName={styles.dialListItem}
                flagClassName={styles.suggestionFlagImage}
                primaryClassName={styles.dialButtonLabel}
                secondaryClassName={styles.dialCountryName}
                onSelect={selectDialCode}
                getLocaleName={getLocaleName}
              />
            </div>
          )}
        </div>

        <input
          {...register(AID_FORM_FIELD.phone, {
            required: true,
            pattern: { value: PHONE_PATTERN, message: t('invalidPhone') },
            onChange: () => clearErrors && clearErrors(AID_FORM_FIELD.phone),
            onBlur: async () => {
              if (trigger) await trigger(AID_FORM_FIELD.phone)
            },
          })}
          className={styles.fieldInput}
          aria-invalid={!!errors.phone || !!errors.dialCode}
          placeholder="123 456 7890"
          autoComplete="off"
        />
      </div>
    </FieldWrapper>
  )
}
