// Application screen components.
// Composes the form UI and connects presentation with feature hooks.
// Main application form component orchestrating feature steps and submission flow.

import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useApplicationForm } from '../hooks'
import { ProgressBar } from '../components/ProgressBar'
import { StepNavigation } from '../components/StepNavigation'
import { AIHelpModal } from '../components/AIHelpModal'
import { Step1 } from '../components/Step1'
import { Step2 } from '../components/Step2'
import { Step3 } from '../components/Step3'
import styles from '../styles/ApplicationForm.module.css'

const stepLabels = ['personalInformation', 'familyFinancialInfo', 'situationDescriptions'] as const

export const ApplicationForm = () => {
  const {
    application,
    helpField,
    helpText,
    helpLoading,
    helpError,
    isModalOpen,
    toastMessage,
    toastType,
    toastDismissed,
    currentStep,
    register,
    handleSubmit,
    getValues,
    setValue,
    setHelpText,
    formState,
    stepContainerVariants,
    handleNext,
    handleBack,
    handleSubmitApplication,
    openHelp,
    handleAccept,
    handleDiscard,
    changeLanguage,
  } = useApplicationForm()

  const { t } = useTranslation()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 register={register} setValue={setValue} getValues={getValues} errors={formState.errors} />
      case 2:
        return <Step2 register={register} errors={formState.errors} />
      default:
        return <Step3 register={register} errors={formState.errors} onHelp={openHelp} loadingField={helpLoading ? helpField : null} />
    }
  }

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
            <select
              id="language-select"
              value={application.language}
              onChange={(event) => changeLanguage(event.target.value as 'en' | 'ar')}
              className={styles.languageSelect}
            >
              <option value="en">{t('english')}</option>
              <option value="ar">{t('arabic')}</option>
            </select>
          </div>
        </header>

        <div className={styles.progressRow}>
          <ProgressBar currentStep={currentStep} />
          <div className={styles.stepLabel}>{t(stepLabels[currentStep - 1])}</div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(handleSubmitApplication)} noValidate>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className={styles.stepContainer}
              variants={stepContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <StepNavigation
            currentStep={currentStep}
            canGoBack={currentStep > 1}
            isSubmitting={application.submitStatus === 'submitting'}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit(handleSubmitApplication)}
          />
        </form>
      </motion.section>

      {toastMessage && !toastDismissed ? (
        <div className={`${styles.toast} ${toastType === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toastMessage}
        </div>
      ) : null}

      <AIHelpModal
        visible={isModalOpen}
        title={helpField ? t(
          helpField === 'financialSituation'
            ? 'currentFinancialSituation'
            : helpField === 'employmentCircumstances'
            ? 'employmentCircumstances'
            : 'reasonForApplying'
        ) : ''}
        value={helpText}
        loading={helpLoading}
        error={helpError ?? undefined}
        onClose={handleDiscard}
        onAccept={handleAccept}
        onDiscard={handleDiscard}
        onChange={setHelpText}
      />
    </main>
  )
}

