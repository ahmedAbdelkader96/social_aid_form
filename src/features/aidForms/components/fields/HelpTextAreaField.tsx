import { useTranslation } from 'react-i18next'
import type { FieldErrors, UseFormClearErrors, UseFormRegister, UseFormTrigger } from 'react-hook-form'
import type { AidFormValues, HelpField } from '../../types/aidFormTypes'
import { FieldWrapper } from './FieldWrapper'
import { showToast } from '../../../../shared/services/toastService'
import styles from '../../styles/AidForm.module.css'

interface HelpTextAreaFieldProps {
  label: string
  field: Extract<keyof AidFormValues, string>
  register: UseFormRegister<AidFormValues>
  trigger?: UseFormTrigger<AidFormValues>
  error?: FieldErrors<AidFormValues>[Extract<keyof AidFormValues, string>]
  onHelp: (field: HelpField) => void
  loading: boolean
  clearErrors?: UseFormClearErrors<AidFormValues>
  helpButtonLabel: string
  delayIndex: number
  rows?: number
}

export function HelpTextAreaField({
  label,
  field,
  register,
  trigger,
  error,
  onHelp,
  loading,
  clearErrors,
  helpButtonLabel,
  delayIndex,
  rows = 4,
}: HelpTextAreaFieldProps) {
  const { t } = useTranslation()

  const validateFieldOnBlur = async (value: string) => {
    if (trigger) await trigger(field)
    if (!String(value ?? '').trim()) {
      showToast(t('fieldRequired', { field: t(label) }), 'error')
    }
  }

  return (
    <FieldWrapper
      label={t(label)}
      delayIndex={delayIndex}
      error={error ? t('fieldRequired', { field: t(label) }) : undefined}
    >
      {
        (() => {
          const reg = register(field, { required: true })
          return (
            <textarea
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
                  await validateFieldOnBlur((e.target as HTMLTextAreaElement).value)
                }
              }}
              className={styles.fieldTextarea}
              aria-invalid={!!error}
              rows={rows}
            />
          )
        })()
      }
      <button
        type="button"
        className={styles.helpButton}
        onClick={() => onHelp(field as HelpField)}
        disabled={loading}
      >
        {loading ? t('loading') : t(helpButtonLabel)}
      </button>
    </FieldWrapper>
  )
}
