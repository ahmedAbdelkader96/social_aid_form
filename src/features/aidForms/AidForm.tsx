// Main aidForm form component orchestrating feature steps and submission flow.
import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import SelectMenu from '../../shared/ui/SelectMenu'
import { useAidForm } from './hooks/useAidForm'
import { ProgressBar } from './components/ProgressBar'
import { FormNavigation } from './components/FormNavigation'
import { AID_FORM_LANGUAGE, AID_FORM_STEP } from './types/aidFormTypes'
import { stepDefinitions } from './stepDefinitions'
import type { AidFormLanguage } from './types/aidFormTypes'
import styles from './styles/AidForm.module.css'

const SuggestionDialog = lazy(() => import('./components/SuggestionDialog').then((module) => ({ default: module.SuggestionDialog })))

const stepContainerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -40, scale: 0.98 },
}

export const AidForm = () => {
  const {
    aidForm,
    register,
    handleSubmit,
    trigger,
    control,
    setValue,
    formState,
    clearErrors,
    currentStep,
    stepTitle,
    isSubmitting,
    helpField,
    helpText,
    helpLoading,
    helpError,
    isModalOpen,
    toast,
    handleDismissToast,
    handleInvalidSubmit,
    handleNext,
    handleBack,
    handleSubmitAidForm,
    openSuggestion,
    handleAcceptSuggestion,
    handleDiscardSuggestion,
    setHelpText,
    changeLanguage,
  } = useAidForm()
  const { t } = useTranslation()

  const stepProps = { register, errors: formState.errors, trigger, clearErrors, dismissToast: handleDismissToast }
  const ActiveStep = stepDefinitions[currentStep].Component
  const stepExtraProps =
    currentStep === AID_FORM_STEP.step1
      ? { control, setValue }
      : currentStep === AID_FORM_STEP.step3
      ? { onHelp: openSuggestion, loadingField: helpLoading ? helpField : null }
      : {}

  const renderStep = () => <ActiveStep {...stepProps} {...stepExtraProps} />

  return (
    <main className={styles.pageWrapper}>
      <motion.section
        className={styles.card}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <header className={styles.cardHeader}>
          <div>
            <p className={styles.subtitle}>{t('subtitle')}</p>
            <h1 className={styles.title}>{t('title')}</h1>
          </div>
          <div className={styles.languageToggle}>
            <label className={styles.languageLabel} htmlFor="language-select">
              {t('languageLabel')}:
            </label>
            <SelectMenu
              id="language-select"
              value={aidForm.language}
              onValueChange={(val) => changeLanguage(val as AidFormLanguage)}
              options={[
                { value: AID_FORM_LANGUAGE.en, label: t('english') },
                { value: AID_FORM_LANGUAGE.ar, label: t('arabic') },
              ]}
              className={styles.languageSelect}
            />
          </div>
        </header>

        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span>{t('progress')}</span>
            <strong>{t('step', { count: currentStep })}</strong>
          </div>
          <ProgressBar currentStep={currentStep} />
        </div>

        <form className={styles.formWrapper} onSubmit={handleSubmit(handleSubmitAidForm, handleInvalidSubmit)} autoComplete="off">
          <section aria-labelledby="step-heading" className={styles.stepSection}>
            <h2 id="step-heading" className={styles.stepHeading}>
              {t(stepTitle)}
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepContainerVariants}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </section>

          <FormNavigation
            currentStep={currentStep}
            canGoBack={currentStep > 1}
            isSubmitting={isSubmitting}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit(handleSubmitAidForm, handleInvalidSubmit)}
          />
        </form>
      </motion.section>

      <AnimatePresence>
        {toast ? (
          <motion.div
            className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className={styles.toastContent}>
              <span>{toast.message}</span>
              <button
                type="button"
                className={styles.toastCloseButton}
                aria-label={t('close')}
                onClick={handleDismissToast}
              >
                ×
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Suspense fallback={null}>
        <SuggestionDialog
          visible={isModalOpen}
          title={t('suggestions')}
          value={helpText}
          loading={helpLoading}
          error={helpError ?? undefined}
          onClose={handleDiscardSuggestion}
          onAccept={handleAcceptSuggestion}
          onDiscard={handleDiscardSuggestion}
          onChange={setHelpText}
        />
      </Suspense>
    </main>
  )
}


