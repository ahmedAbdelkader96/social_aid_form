import { useTranslation } from 'react-i18next'
import type { AidFormValues, HelpField } from '../../types/aidFormTypes'
import type { FormFieldProps } from '../../types/formFieldTypes'
import { FieldWrapper } from './FieldWrapper'
import styles from '../../styles/AidForm.module.css'

import { enhanceRegisterEvent } from '../../utils/rhfHelpers'

interface HelpTextAreaFieldProps extends FormFieldProps {
  label: string
  field: Extract<keyof AidFormValues, string>
  onHelp: (field: HelpField) => void
  loading: boolean
  helpButtonLabel: string
  delayIndex: number
  rows?: number
}

export function HelpTextAreaField({
  label,
  field,
  register,
  trigger,
  errors,
  onHelp,
  loading,
  clearErrors,
  helpButtonLabel,
  delayIndex,
  dismissToast,
  rows = 4,
}: HelpTextAreaFieldProps) {
  const { t } = useTranslation()

  const reg = enhanceRegisterEvent(register(field, { required: true }), field, trigger, clearErrors, dismissToast ?? undefined)
  const hasError = !!errors[field]

  return (
    <FieldWrapper label={t(label)} delayIndex={delayIndex}>
      <textarea
        {...reg}
        className={styles.fieldTextarea}
        aria-invalid={hasError}
        rows={rows}
      />
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
