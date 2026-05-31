import type { FC } from 'react'
import type { UseFormRegister } from 'react-hook-form'
import type { AidFormValues } from '../../types/aidFormTypes'
import type { FormFieldProps } from '../../types/formFieldTypes'
import { enhanceRegisterEvent } from '../../utils/rhfHelpers'
import { FieldWrapper } from './FieldWrapper'
import styles from '../../styles/AidForm.module.css'

interface TextFieldProps extends FormFieldProps {
  field: keyof AidFormValues
  label: string
  delayIndex: number
  type?: string
  placeholder?: string
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'
  min?: string
  step?: string
  className?: string
  registerOptions?: Parameters<UseFormRegister<AidFormValues>>[1]
}

export const TextField: FC<TextFieldProps> = ({
  field,
  label,
  register,
  errors,
  trigger,
  clearErrors,
  dismissToast,
  delayIndex,
  type = 'text',
  placeholder,
  inputMode,
  min,
  step,
  className,
  registerOptions,
}) => {
  const reg = enhanceRegisterEvent(
    register(field, { required: true, ...registerOptions }),
    field,
    trigger,
    clearErrors,
    dismissToast ?? undefined,
  )

  return (
    <FieldWrapper label={label} delayIndex={delayIndex}>
      <input
        {...reg}
        type={type}
        placeholder={placeholder}
        inputMode={inputMode}
        min={min}
        step={step}
        className={className ?? styles.fieldInput}
        aria-invalid={!!errors[field]}
      />
    </FieldWrapper>
  )
}
