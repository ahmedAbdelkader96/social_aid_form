// Second form step for family, employment, and financial details.
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { FieldErrors, UseFormRegister, UseFormClearErrors, UseFormTrigger } from 'react-hook-form'
import type { AidFormValues } from '../types/aidFormTypes'
import { AID_FORM_FIELD } from '../types/aidFormTypes'
import { FieldWrapper } from './fields/FieldWrapper'
import { SelectField } from './fields/SelectField'
import { showToast } from '../../../shared/services/toastService'
import { getMaritalStatusOptions, getEmploymentStatusOptions, getHousingStatusOptions } from '../utils/aidFormSelectOptions'
import styles from '../styles/AidForm.module.css'

 interface Step2Props {
  register: UseFormRegister<AidFormValues>
  trigger?: UseFormTrigger<AidFormValues>
  errors: FieldErrors<AidFormValues>
  clearErrors?: UseFormClearErrors<AidFormValues>
 }

export const Step2: FC<Step2Props> = ({ register, trigger, errors, clearErrors }) => {
  const { t } = useTranslation()

  const validateFieldOnBlur = async (field: keyof AidFormValues, value: string) => {
    if (trigger) await trigger(field)

    if (!String(value ?? '').trim()) {
      showToast(t('fieldRequired', { field: t(field) }), 'error')
    }
  }

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
        delayIndex={0}
      />

      <FieldWrapper
        delayIndex={1}
        label={t('dependents')}
        error={errors.dependents ? t('fieldRequired', { field: t('dependents') }) : undefined}
      >
        <input
          type="number"
          min="0"
          {...register(AID_FORM_FIELD.dependents, {
            required: true,
            valueAsNumber: true,
            onChange: () => clearErrors && clearErrors(AID_FORM_FIELD.dependents),
            onBlur: async (event) => {
              await validateFieldOnBlur(AID_FORM_FIELD.dependents, event.target.value)
            },
          })}
          className={styles.fieldInput}
          aria-invalid={!!errors.dependents}
        />
      </FieldWrapper>

      <SelectField
        field={AID_FORM_FIELD.employmentStatus}
        label={t('employmentStatus')}
        placeholder={t('selectStatus')}
        options={getEmploymentStatusOptions(t)}
        register={register}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        delayIndex={2}
      />

      <FieldWrapper
        delayIndex={3}
        label={t('monthlyIncome')}
        error={errors.monthlyIncome ? t('fieldRequired', { field: t('monthlyIncome') }) : undefined}
      >
        <input
          type="number"
          min="0"
          step="0.01"
          {...register(AID_FORM_FIELD.monthlyIncome, {
            required: true,
            valueAsNumber: true,
            onChange: () => clearErrors && clearErrors(AID_FORM_FIELD.monthlyIncome),
            onBlur: async (event) => {
              await validateFieldOnBlur(AID_FORM_FIELD.monthlyIncome, event.target.value)
            },
          })}
          className={styles.fieldInput}
          aria-invalid={!!errors.monthlyIncome}
        />
      </FieldWrapper>

      <SelectField
        field={AID_FORM_FIELD.housingStatus}
        label={t('housingStatus')}
        placeholder={t('selectStatus')}
        options={getHousingStatusOptions(t)}
        register={register}
        trigger={trigger}
        errors={errors}
        clearErrors={clearErrors}
        delayIndex={4}
      />
    </div>
  )
}


