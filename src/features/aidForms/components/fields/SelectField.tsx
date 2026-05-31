import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import type {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormTrigger,
} from 'react-hook-form'
import type { Option } from '../../../../shared/ui/SelectMenu'
import SelectMenu from '../../../../shared/ui/SelectMenu'
import type { AidFormValues } from '../../types/aidFormTypes'
import { FieldWrapper } from './FieldWrapper'
import styles from '../../styles/AidForm.module.css'

interface SelectFieldProps {
  field: keyof AidFormValues
  label: string
  placeholder: string
  options: Option[]
  register: UseFormRegister<AidFormValues>
  errors: FieldErrors<AidFormValues>
  trigger?: UseFormTrigger<AidFormValues>
  clearErrors?: UseFormClearErrors<AidFormValues>
  delayIndex: number
  className?: string
  registerOptions?: Parameters<UseFormRegister<AidFormValues>>[1]
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
  delayIndex,
  className,
  registerOptions,
}) => {
  const { t } = useTranslation()
  const error = errors[field] ? t('fieldRequired', { field: label }) : undefined

  return (
    <FieldWrapper label={label} delayIndex={delayIndex} error={error}>
      {
        (() => {
          const reg = register(field, { required: true, ...registerOptions })
          return (
            <SelectMenu
              {...reg}
              onChange={(e) => {
                try {
                  if (typeof (reg as any).onChange === 'function') (reg as any).onChange(e)
                } finally {
                  if (clearErrors) clearErrors(field)
                }
              }}
              onBlur={async (e) => {
                try {
                  if (typeof (reg as any).onBlur === 'function') await (reg as any).onBlur(e)
                } finally {
                  if (trigger) await trigger(field)
                }
              }}
              options={[{ value: '', label: placeholder }, ...options]}
              className={className ?? styles.fieldInput}
              aria-invalid={!!errors[field]}
            />
          )
        })()
      }
    </FieldWrapper>
  )
}
