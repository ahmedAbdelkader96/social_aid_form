import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FC, ChangeEvent } from 'react'
import type CountryModel from '../../../countries/models/CountryModel'
import DialCodeOptionList from '../../../countries/components/DialCodeOptionList'
import { FieldWrapper } from './FieldWrapper'
import { enhanceRegisterEvent } from '../../utils/rhfHelpers'
import type { Step1FieldProps } from '../../types/formFieldTypes'
import { AID_FORM_FIELD } from '../../types/aidFormTypes'
import { PHONE_PATTERN } from '../../../../shared/constants'
import { getCountryLocale, getCountryLocaleName } from '../../../countries/utils/countryLocale'
import styles from '../../styles/AidForm.module.css'

interface PhoneDialFieldProps extends Step1FieldProps {
  options: CountryModel[]
  loading: boolean
  delayIndex: number
}

export const PhoneDialField: FC<PhoneDialFieldProps> = ({
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

  const [dialQuery, setDialQuery] = useState('')
  const [dialOpen, setDialOpen] = useState(false)
  const dialRef = useRef<HTMLDivElement>(null)

  const dialCode = useWatch({ control, name: AID_FORM_FIELD.dialCode })
  const selectedDial = useMemo(() => {
    if (!dialCode || options.length === 0) return null
    return options.find((entry) => entry.dialCode === dialCode) ?? null
  }, [dialCode, options])

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
  }, [dialQuery, options, getLocaleName])

  const validateDialBlur = async () => {
    if (trigger) await trigger(AID_FORM_FIELD.dialCode)
  }

  const selectDialCode = (entry: CountryModel) => {
    setValue(AID_FORM_FIELD.dialCode, entry.dialCode, { shouldValidate: true, shouldDirty: true })
    if (clearErrors) clearErrors(AID_FORM_FIELD.dialCode)
    setDialOpen(false)
  }

  const phoneReg = enhanceRegisterEvent(
    register(AID_FORM_FIELD.phone, {
      required: true,
      pattern: { value: PHONE_PATTERN, message: t('invalidPhone') },
    }),
    AID_FORM_FIELD.phone,
    trigger,
    clearErrors,
    dismissToast ?? undefined,
  )

  return (
    <FieldWrapper label={t('phone')} delayIndex={delayIndex}>
      <div className={styles.phoneInputGroup}>
        <div className={styles.dialPicker} ref={dialRef}>
          <button
            type="button"
            className={styles.dialButton}
            onClick={() => setDialOpen((open: boolean) => !open)}
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

          <input
            type="hidden"
            {...enhanceRegisterEvent(
              register(AID_FORM_FIELD.dialCode, { required: true }),
              AID_FORM_FIELD.dialCode,
              trigger,
              clearErrors,
              dismissToast ?? undefined,
            )}
          />

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
          {...phoneReg}
          className={styles.fieldInput}
          aria-invalid={!!errors.phone || !!errors.dialCode}
          placeholder="123 456 7890"
          autoComplete="off"
        />
      </div>
    </FieldWrapper>
  )
}
