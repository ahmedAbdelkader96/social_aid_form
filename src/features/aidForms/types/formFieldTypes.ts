import type {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import type { AidFormValues, HelpField } from './aidFormTypes'

export interface FormFieldProps {
  register: UseFormRegister<AidFormValues>
  errors: FieldErrors<AidFormValues>
  trigger?: UseFormTrigger<AidFormValues>
  clearErrors?: UseFormClearErrors<AidFormValues>
  dismissToast?: () => void
}

export interface StepProps extends FormFieldProps {
  control?: Control<AidFormValues>
  setValue?: UseFormSetValue<AidFormValues>
  onHelp?: (field: HelpField) => void
  loadingField?: HelpField | null
}

export interface Step1FieldProps extends FormFieldProps {
  control: Control<AidFormValues>
  setValue: UseFormSetValue<AidFormValues>
}
