// Navigation controls for moving between application form steps.
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'
import styles from '../styles/ApplicationForm.module.css'

interface StepNavigationProps {
  currentStep: number
  canGoBack: boolean
  isSubmitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
}

export const StepNavigation: FC<StepNavigationProps> = ({
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
        onClick={currentStep === 3 ? onSubmit : onNext}
        disabled={isSubmitting}
      >
        {isSubmitting ? t('loading') : currentStep === 3 ? t('submit') : t('next')}
      </button>
    </div>
  )
}

