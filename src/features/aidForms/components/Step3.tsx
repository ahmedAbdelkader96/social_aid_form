// Third form step for narrative fields and AI help generation.
import type { FC } from 'react'
import { AID_FORM_HELP_FIELD } from '../types/aidFormTypes'
import type { AidFormValues, HelpField } from '../types/aidFormTypes'
import { HelpTextAreaField } from './fields/HelpTextAreaField'
import type { FormFieldProps } from '../types/formFieldTypes'
import styles from '../styles/AidForm.module.css'

interface Step3Props extends FormFieldProps {
  onHelp: (field: HelpField) => void
  loadingField: HelpField | null
}

export const StatementStep: FC<Step3Props> = ({ register, trigger, errors, onHelp, loadingField, clearErrors, dismissToast }) => {
  return (
    <div className={styles.stepGridColumn}>
      <HelpTextAreaField
        label="currentFinancialSituation"
        field={AID_FORM_HELP_FIELD.financialSituation as keyof AidFormValues}
        register={register}
        trigger={trigger}
        errors={errors}
        onHelp={onHelp}
        loading={loadingField === AID_FORM_HELP_FIELD.financialSituation}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        helpButtonLabel="helpMeWrite"
        delayIndex={0}
        rows={4}
      />
      <HelpTextAreaField
        label="employmentCircumstances"
        field={AID_FORM_HELP_FIELD.employmentCircumstances as keyof AidFormValues}
        register={register}
        trigger={trigger}
        errors={errors}
        onHelp={onHelp}
        loading={loadingField === AID_FORM_HELP_FIELD.employmentCircumstances}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        helpButtonLabel="helpMeWrite"
        delayIndex={1}
        rows={4}
      />
      <HelpTextAreaField
        label="reasonForApplying"
        field={AID_FORM_HELP_FIELD.applicationReason as keyof AidFormValues}
        register={register}
        trigger={trigger}
        errors={errors}
        onHelp={onHelp}
        loading={loadingField === AID_FORM_HELP_FIELD.applicationReason}
        clearErrors={clearErrors}
        dismissToast={dismissToast}
        helpButtonLabel="helpMeWrite"
        delayIndex={2}
        rows={4}
      />
    </div>
  )
}

export const Step3 = StatementStep


