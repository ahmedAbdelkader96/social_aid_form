import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import { AID_FORM_STEP } from '../types/aidFormTypes'
import type { AidFormStep } from '../types/aidFormTypes'
import styles from '../styles/AidForm.module.css'

interface FormNavigationProps {
  currentStep: AidFormStep
  canGoBack: boolean
  isSubmitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export const FormNavigation: FC<FormNavigationProps> = ({
  currentStep,
  canGoBack,
  isSubmitting,
  onBack,
  onNext,
  onSubmit,
}) => {
  const { t } = useTranslation()

  return (
    <div className={styles.navigationRow}>
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={onBack}
        disabled={!canGoBack || isSubmitting}
      >
        {t('previous')}
      </button>
      <button
        type="button"
        className={styles.primaryButton}
        onClick={currentStep === AID_FORM_STEP.step3 ? onSubmit : onNext}
        disabled={isSubmitting}
      >
        {isSubmitting ? t('loading') : currentStep === AID_FORM_STEP.step3 ? t('submit') : t('next')}
      </button>
    </div>
  )
}
