// Second form step for family, employment, and financial details.
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AID_FORM_FIELD } from '../types/aidFormTypes'
import { TextField } from './fields/TextField'
import { SelectField } from './fields/SelectField'
import { getMaritalStatusOptions, getEmploymentStatusOptions, getHousingStatusOptions } from '../utils/aidFormSelectOptions'
import type { FormFieldProps } from '../types/formFieldTypes'
import styles from '../styles/AidForm.module.css'

export const FamilyFinancialStep: FC<FormFieldProps> = ({ register, trigger, errors, clearErrors, dismissToast }) => {
  const { t } = useTranslation()

  return (
    <div className={styles.stepGrid}>
      <SelectField
        field={AID_FORM_FIELD.maritalStatus}
        label={t('maritalStatus')}
        placeholder={t('selectStatus')}
        options={getMaritalStatusOptions(t)}
        register={register}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={0}
      />

      <TextField
        field={AID_FORM_FIELD.dependents}
        type="number"
        label={t('dependents')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={1}
        min="0"
        registerOptions={{ valueAsNumber: true }}
      />

      <SelectField
        field={AID_FORM_FIELD.employmentStatus}
        label={t('employmentStatus')}
        placeholder={t('selectStatus')}
        options={getEmploymentStatusOptions(t)}
        register={register}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={2}
      />

      <TextField
        field={AID_FORM_FIELD.monthlyIncome}
        type="number"
        label={t('monthlyIncome')}
        register={register}
        errors={errors}
        trigger={trigger}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={3}
        min="0"
        step="0.01"
        registerOptions={{ valueAsNumber: true }}
      />

      <SelectField
        field={AID_FORM_FIELD.housingStatus}
        label={t('housingStatus')}
        placeholder={t('selectStatus')}
        options={getHousingStatusOptions(t)}
        register={register}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        delayIndex={4}
      />
    </div>
  )
}

export const Step2 = FamilyFinancialStep


