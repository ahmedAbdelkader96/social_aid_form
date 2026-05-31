// Personal details step for name, contact, and address fields.
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { AID_FORM_FIELD } from '../types/aidFormTypes'
import { TextField } from './fields/TextField'
import { SelectField } from './fields/SelectField'
import { CountryLookupField } from './fields/CountryLookupField'
import { PhoneDialField } from './fields/PhoneDialField'
import { EMAIL_PATTERN, NUMBER_PATTERN } from '../../../shared/constants'
import { getGenderOptions } from '../utils/aidFormSelectOptions'
import type { Step1FieldProps } from '../types/formFieldTypes'
import { useCountries } from '../../countries/hooks/useCountries'
// toast display intentionally handled at submit/next level
import styles from '../styles/AidForm.module.css'

export const PersonalDetailsStep: FC<Step1FieldProps> = ({ register, control, setValue, trigger, errors, clearErrors, dismissToast }) => {
  const { t } = useTranslation()
  const { countries: countryOptions, loading } = useCountries()

  return (
    <div className={styles.stepGrid}>
      <TextField
        field={AID_FORM_FIELD.name}
        label={t('name')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={0}
      />

      <TextField
        field={AID_FORM_FIELD.nationalId}
        type="text"
        label={t('nationalId')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={1}
        inputMode="numeric"
        placeholder="123456789"
        registerOptions={{ pattern: { value: NUMBER_PATTERN, message: t('invalidNationalId') } }}
      />

      <TextField
        field={AID_FORM_FIELD.dateOfBirth}
        type="date"
        label={t('dateOfBirth')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        delayIndex={2}
      />

      <SelectField
        field={AID_FORM_FIELD.gender}
        label={t('gender')}
        placeholder={t('selectGender')}
        options={getGenderOptions(t)}
        register={register}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={3}
      />

      <PhoneDialField
        register={register}
        control={control}
        setValue={setValue}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        options={countryOptions}
        loading={loading}
        delayIndex={4}
      />

      <CountryLookupField
        register={register}
        control={control}
        setValue={setValue}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        options={countryOptions}
        loading={loading}
        delayIndex={5}
      />

      <TextField
        field={AID_FORM_FIELD.address}
        label={t('address')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={6}
      />

      <TextField
        field={AID_FORM_FIELD.state}
        label={t('state')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={7}
      />

      <TextField
        field={AID_FORM_FIELD.city}
        label={t('city')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={8}
      />

      <TextField
        field={AID_FORM_FIELD.email}
        type="email"
        label={t('email')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={9}
        registerOptions={{ pattern: { value: EMAIL_PATTERN, message: t('invalidEmail') } }}
      />
    </div>
  )
}

export const Step1 = PersonalDetailsStep
