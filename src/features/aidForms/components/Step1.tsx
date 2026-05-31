// First form step for personal details, country selection, and phone input.
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import type {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors,
  UseFormTrigger,
} from 'react-hook-form'
import type { AidFormValues } from '../types/aidFormTypes'
import { AID_FORM_FIELD } from '../types/aidFormTypes'
import { FieldWrapper } from './fields/FieldWrapper'
import { SelectField } from './fields/SelectField'
import { CountryLookupField } from './fields/CountryLookupField'
import { PhoneDialField } from './fields/PhoneDialField'
import { fetchCountriesAsync } from '../../countries/stores'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { EMAIL_PATTERN, NUMBER_PATTERN } from '../../../shared/constants'
import { getGenderOptions } from '../utils/aidFormSelectOptions'
// toast display intentionally handled at submit/next level
import styles from '../styles/AidForm.module.css'

interface Step1Props {
  register: UseFormRegister<AidFormValues>
  setValue: UseFormSetValue<AidFormValues>
  getValues: UseFormGetValues<AidFormValues>
  trigger?: UseFormTrigger<AidFormValues>
  errors: FieldErrors<AidFormValues>
  clearErrors?: UseFormClearErrors<AidFormValues>
}

export const Step1: FC<Step1Props> = ({ register, setValue, getValues, trigger, errors, clearErrors }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const countriesState = useAppSelector((state) => state.countries)

  const countryOptions = countriesState.items
  const loading = countriesState.status === 'loading'

  useEffect(() => {
    dispatch(fetchCountriesAsync())
  }, [dispatch])

  const validateFieldOnBlur = async (field: keyof AidFormValues) => {
    // Only trigger field validation on blur. Do not show toast here.
    if (trigger) await trigger(field)
  }

  type FieldRegisterOptions = Parameters<UseFormRegister<AidFormValues>>[1]

  const registerField = (field: keyof AidFormValues, options?: FieldRegisterOptions) => {
    const reg = register(field, { required: true, ...options })
    // Wrap onBlur to call RHF's internal onBlur and then our field validation helper.
    return {
      ...reg,
      onBlur: async (e: unknown) => {
        try {
          if (typeof (reg as any).onBlur === 'function') await (reg as any).onBlur(e)
        } finally {
          await validateFieldOnBlur(field)
        }
      },
    }
  }

  return (
    <motion.div className={styles.stepGrid}>
      <FieldWrapper className={styles.fieldLabel} delayIndex={0} label={t('name')} error={errors.name ? t('fieldRequired', { field: t('name') }) : undefined}>
        <input
          {...registerField(AID_FORM_FIELD.name)}
          className={styles.fieldInput}
          aria-invalid={!!errors.name}
        />
      </FieldWrapper>

      <FieldWrapper className={styles.fieldLabel} delayIndex={1} label={t('nationalId')} error={errors.nationalId ? t('invalidNationalId') : undefined}>
        <input
          {...registerField(AID_FORM_FIELD.nationalId, {
            pattern: { value: NUMBER_PATTERN, message: t('invalidNationalId') },
          })}
          className={styles.fieldInput}
          aria-invalid={!!errors.nationalId}
          inputMode="numeric"
          placeholder="123456789"
          autoComplete="off"
        />
      </FieldWrapper>

      <FieldWrapper delayIndex={2} label={t('dateOfBirth')} error={errors.dateOfBirth ? t('fieldRequired', { field: t('dateOfBirth') }) : undefined}>
        <input
          type="date"
          {...registerField(AID_FORM_FIELD.dateOfBirth)}
          className={styles.fieldInput}
          aria-invalid={!!errors.dateOfBirth}
        />
      </FieldWrapper>

      <SelectField
        field={AID_FORM_FIELD.gender}
        label={t('gender')}
        placeholder={t('selectGender')}
        options={getGenderOptions(t)}
        register={register}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        delayIndex={3}
      />

      <PhoneDialField
        register={register}
        getValues={getValues}
        setValue={setValue}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        options={countryOptions}
        loading={loading}
        delayIndex={4}
      />

      <CountryLookupField
        register={register}
        getValues={getValues}
        setValue={setValue}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        options={countryOptions}
        loading={loading}
        delayIndex={5}
      />

      <FieldWrapper delayIndex={6} label={t('address')} error={errors.address ? t('fieldRequired', { field: t('address') }) : undefined}>
        <input
          {...registerField(AID_FORM_FIELD.address)}
          className={styles.fieldInput}
          aria-invalid={!!errors.address}
        />
      </FieldWrapper>

      <FieldWrapper delayIndex={7} label={t('state')} error={errors.state ? t('fieldRequired', { field: t('state') }) : undefined}>
        <input
          {...registerField(AID_FORM_FIELD.state)}
          className={styles.fieldInput}
          aria-invalid={!!errors.state}
        />
      </FieldWrapper>

      <FieldWrapper delayIndex={8} label={t('city')} error={errors.city ? t('fieldRequired', { field: t('city') }) : undefined}>
        <input
          {...registerField(AID_FORM_FIELD.city)}
          className={styles.fieldInput}
          aria-invalid={!!errors.city}
        />
      </FieldWrapper>

      <FieldWrapper delayIndex={9} label={t('email')} error={errors.email ? t('fieldRequired', { field: t('email') }) : undefined}>
        <input
          type="email"
          {...registerField(AID_FORM_FIELD.email, {
            pattern: EMAIL_PATTERN,
          })}
          className={styles.fieldInput}
          aria-invalid={!!errors.email}
        />
      </FieldWrapper>
    </motion.div>
  )
}
