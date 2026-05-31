import type { ChangeEvent, FC } from 'react'
import type { UseFormRegister, UseFormSetValue } from 'react-hook-form'
import type { Option } from '../../../../shared/ui/SelectMenu'
import SelectMenu from '../../../../shared/ui/SelectMenu'
import type { AidFormValues } from '../../types/aidFormTypes'
import type { FormFieldProps } from '../../types/formFieldTypes'
import { enhanceRegisterEvent } from '../../utils/rhfHelpers'
import { FieldWrapper } from './FieldWrapper'
import styles from '../../styles/AidForm.module.css'

interface SelectFieldProps extends FormFieldProps {
  field: keyof AidFormValues
  label: string
  placeholder: string
  options: Option[]
  delayIndex: number
  className?: string
  registerOptions?: Parameters<UseFormRegister<AidFormValues>>[1]
  setValue?: UseFormSetValue<AidFormValues>
}

export const SelectField: FC<SelectFieldProps> = ({
  field,
  label,
  placeholder,
  options,
  register,
  errors,
  trigger,
  clearErrors,
  dismissToast,
  setValue,
  delayIndex,
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

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (typeof reg.onChange === 'function') reg.onChange(event)
    if (setValue) {
      setValue(field, event.target.value as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      })
    }
    if (clearErrors) clearErrors(field)
    if (dismissToast) dismissToast()
  }

  return (
    <FieldWrapper label={label} delayIndex={delayIndex}>
      <SelectMenu
        {...reg}
        options={[{ value: '', label: placeholder }, ...options]}
        className={className ?? styles.fieldInput}
        aria-invalid={!!errors[field]}
        onChange={handleChange}
      />
    </FieldWrapper>
  )
}
