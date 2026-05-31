// Third form step for narrative fields and AI help generation.
import type { FC } from 'react'
import type { FieldErrors, UseFormRegister, UseFormClearErrors, UseFormTrigger } from 'react-hook-form'
import { AID_FORM_HELP_FIELD } from '../types/aidFormTypes'
import type { AidFormValues, HelpField } from '../types/aidFormTypes'
import { HelpTextAreaField } from './fields/HelpTextAreaField'
import styles from '../styles/AidForm.module.css'

 interface Step3Props {
  register: UseFormRegister<AidFormValues>
  trigger?: UseFormTrigger<AidFormValues>
  errors: FieldErrors<AidFormValues>
  onHelp: (field: HelpField) => void
  loadingField: HelpField | null
  clearErrors?: UseFormClearErrors<AidFormValues>
 }

export const Step3: FC<Step3Props> = ({ register, trigger, errors, onHelp, loadingField, clearErrors }) => {
  return (
    <div className={styles.stepGridColumn}>
      <HelpTextAreaField
        label="currentFinancialSituation"
        field={AID_FORM_HELP_FIELD.financialSituation as keyof AidFormValues}
        register={register}
        trigger={trigger}
        error={errors[AID_FORM_HELP_FIELD.financialSituation as keyof AidFormValues]}
        onHelp={onHelp}
        loading={loadingField === AID_FORM_HELP_FIELD.financialSituation}
        clearErrors={clearErrors}
        helpButtonLabel="helpMeWrite"
        delayIndex={0}
        rows={4}
      />
      <HelpTextAreaField
        label="employmentCircumstances"
        field={AID_FORM_HELP_FIELD.employmentCircumstances as keyof AidFormValues}
        register={register}
        trigger={trigger}
        error={errors[AID_FORM_HELP_FIELD.employmentCircumstances as keyof AidFormValues]}
        onHelp={onHelp}
        loading={loadingField === AID_FORM_HELP_FIELD.employmentCircumstances}
        clearErrors={clearErrors}
        helpButtonLabel="helpMeWrite"
        delayIndex={1}
        rows={4}
      />
      <HelpTextAreaField
        label="reasonForApplying"
        field={AID_FORM_HELP_FIELD.applicationReason as keyof AidFormValues}
        register={register}
        trigger={trigger}
        error={errors[AID_FORM_HELP_FIELD.applicationReason as keyof AidFormValues]}
        onHelp={onHelp}
        loading={loadingField === AID_FORM_HELP_FIELD.applicationReason}
        clearErrors={clearErrors}
        helpButtonLabel="helpMeWrite"
        delayIndex={2}
        rows={4}
      />
    </div>
  )
}


