import type {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form'
import type { AidFormValues } from './aidFormTypes'

export interface FormFieldProps {
  register: UseFormRegister<AidFormValues>
  errors: FieldErrors<AidFormValues>
  trigger?: UseFormTrigger<AidFormValues>
  clearErrors?: UseFormClearErrors<AidFormValues>
  dismissToast?: () => void
}

export interface Step1FieldProps extends FormFieldProps {
  control: Control<AidFormValues>
  setValue: UseFormSetValue<AidFormValues>
}
