import type { ChangeEvent, FC } from 'react'
import type { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import type { AidFormValues } from '../../types/aidFormTypes'
import type { FormFieldProps } from '../../types/formFieldTypes'
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
  setValue?: UseFormSetValue<AidFormValues>
}

export const TextField: FC<TextFieldProps> = ({
  field,
  label,
  register,
  errors,
  clearErrors,
  dismissToast,
  setValue,
  delayIndex,
  type = 'text',
  placeholder,
  inputMode,
  min,
  step,
  className,
  registerOptions,
}) => {
  const reg = register(field, { required: true, ...registerOptions })

  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (typeof reg.onChange === 'function') reg.onChange(event)
    if (setValue) {
      const rawValue = event.target.value
      const value = type === 'number' && registerOptions?.valueAsNumber ? event.target.valueAsNumber : rawValue
      setValue(field, value as any, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    }
    if (clearErrors) clearErrors(field)
    if (dismissToast) dismissToast()
  }

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
        onChange={updateValue}
      />
    </FieldWrapper>
  )
}
