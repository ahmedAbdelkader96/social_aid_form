// Main application form component orchestrating feature steps and submission flow.
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  setLanguage,
  setStep,
  setSubmitError,
  setSubmitStatus,
  submitApplicationAsync,
  updateForm,
} from './stores'
import { generateOpenAISuggestion } from '../../global/api/openAiClient'
import { htmlDecode } from '../../global/helpers/htmlDecode'
import { ProgressBar } from './components/ProgressBar'
import { StepNavigation } from './components/StepNavigation'
import { AIHelpModal } from './components/AIHelpModal'
import { Step1 } from './components/Step1'
import { Step2 } from './components/Step2'
import { Step3 } from './components/Step3'
import { defaultForm } from './models/applicationTypes'
import type { ApplicationFormValues } from './models/applicationTypes'
import styles from './styles/ApplicationForm.module.css'

const stepLabels = ['personalInformation', 'familyFinancialInfo', 'situationDescriptions'] as const

export const ApplicationForm = () => {
  const dispatch = useAppDispatch()
  const application = useAppSelector((state) => state.application)
  const { t, i18n } = useTranslation()
  const [helpField, setHelpField] = useState<keyof ApplicationFormValues | null>(null)
  const [helpText, setHelpText] = useState('')
  const [helpLoading, setHelpLoading] = useState(false)
  const [helpError, setHelpError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error' | ''>('')

  const { register, handleSubmit, trigger, getValues, setValue, formState, reset } = useForm<ApplicationFormValues>({
    mode: 'onBlur',
    defaultValues: application.form,
  })

  useEffect(() => {
    reset(application.form)
  }, [application.form, reset])

  useEffect(() => {
    i18n.changeLanguage(application.language)
    document.documentElement.dir = application.language === 'ar' ? 'rtl' : 'ltr'
  }, [application.language, i18n])

  useEffect(() => {
    if (application.submitStatus === 'success') {
      setToastMessage(t('submissionSuccess'))
      setToastType('success')
      const timeout = window.setTimeout(() => setToastMessage(''), 4000)
      return () => window.clearTimeout(timeout)
    }

    if (application.submitStatus === 'failed') {
      setToastMessage(application.submitError ?? t('submissionError'))
      setToastType('error')
      const timeout = window.setTimeout(() => setToastMessage(''), 4000)
      return () => window.clearTimeout(timeout)
    }

    return undefined
  }, [application.submitStatus, application.submitError, t])

  const currentFields = useMemo(() => {
    switch (application.currentStep) {
      case 1:
        return ['name', 'nationalId', 'dateOfBirth', 'gender', 'address', 'city', 'state', 'countryCode', 'phone', 'email'] as const
      case 2:
        return ['maritalStatus', 'dependents', 'employmentStatus', 'monthlyIncome', 'housingStatus'] as const
      default:
        return ['financialSituation', 'employmentCircumstances', 'applicationReason'] as const
    }
  }, [application.currentStep])

  const saveProgress = async () => {
    const values = getValues()
    dispatch(updateForm(values))
  }

  const handleNext = async () => {
    const valid = await trigger(currentFields)
    if (!valid) {
      return
    }
    await saveProgress()
    dispatch(setStep((application.currentStep + 1) as 1 | 2 | 3))
  }

  const handleBack = () => {
    dispatch(setStep((application.currentStep - 1) as 1 | 2 | 3))
  }

  const handleSubmitApplication = async (values: ApplicationFormValues) => {
    dispatch(updateForm(values))
    dispatch(setSubmitStatus('submitting'))
    dispatch(setSubmitError(null))
    const resultAction = await dispatch(submitApplicationAsync(values))

    if (submitApplicationAsync.rejected.match(resultAction)) {
      dispatch(setSubmitStatus('failed'))
      const errorMessage = resultAction.payload ?? resultAction.error.message ?? 'Unable to submit application.'
      dispatch(setSubmitError(errorMessage))
      return
    }

    if (submitApplicationAsync.fulfilled.match(resultAction)) {
      dispatch(updateForm(defaultForm))
      dispatch(setStep(1))
      setHelpField(null)
      setHelpText('')
      setHelpError(null)
      setIsModalOpen(false)
    }
  }

  const openHelp = async (field: keyof ApplicationFormValues) => {
    setHelpField(field)
    setHelpText('')
    setHelpError(null)
    
    setHelpLoading(true)
    setIsModalOpen(true)
    try {
      const values = getValues()
      const suggestion = await generateOpenAISuggestion(field, values)
      setHelpText(htmlDecode(suggestion))
    } catch (error) {
      setHelpError(error instanceof Error ? error.message : 'Unable to generate suggestion.')
    } finally {
      setHelpLoading(false)
    }
  }

  const handleAccept = () => {
    if (!helpField) {
      return
    }
    // Close modal first, then apply suggestion to the form field
    setIsModalOpen(false)
    setTimeout(() => {
      let appliedText = helpText

      // If employmentCircumstances, prefer the quoted suggestion only
      if (helpField === 'employmentCircumstances' || helpField === 'financialSituation') {
        // Match straight or smart double quotes first
        const quoted = helpText.match(/["“”]([^"“”]+)["“”]/u)
        if (quoted && quoted[1]) {
          appliedText = quoted[1].trim()
        } else {
          // Try single quotes
          const single = helpText.match(/'([^']+)'/)
          if (single && single[1]) {
            appliedText = single[1].trim()
          } else {
            // Fallback: look for common phrases and take the clause after them
            const colonMatch = helpText.match(/(?:You could say:|The given description is:|You could try:|consider:\s*)([\s\S]+)/i)
            if (colonMatch && colonMatch[1]) {
              // take up to the first question mark or the first quoted-like sentence
              let candidate = colonMatch[1].trim()
              const qIndex = candidate.indexOf('?')
              if (qIndex !== -1) candidate = candidate.slice(0, qIndex)
              // strip surrounding quotes if present
              candidate = candidate.replace(/^["'“”`\s]+|["'“”`\s]+$/g, '')
              // take first sentence
              const sentences = candidate.split(/[\.\n]+/).map(s => s.trim()).filter(Boolean)
              if (sentences.length) appliedText = sentences[0]
            } else {
              // As a last resort, remove trailing question part
              const qIndex2 = appliedText.lastIndexOf('?')
              if (qIndex2 !== -1) {
                const before = appliedText.slice(0, qIndex2 + 1)
                const sentences = before.split(/[\.\n]+/).map(s => s.trim()).filter(Boolean)
                if (sentences.length) appliedText = sentences[sentences.length - 1]
              }
            }
          }
        }
      }

      setValue(helpField, appliedText, { shouldDirty: true, shouldTouch: true })
      dispatch(updateForm({ [helpField]: appliedText }))

      // Also ensure the textarea DOM reflects the change and receive focus
      setTimeout(() => {
        try {
          const el = document.querySelector(`textarea[name="${String(helpField)}"]`) as HTMLTextAreaElement | null
          if (el) {
            el.value = appliedText
            el.dispatchEvent(new Event('input', { bubbles: true }))
            el.focus()
          }
        } catch (e) {
          // ignore DOM update errors
        }
      }, 0)
    }, 0)
  }

  const handleDiscard = () => {
    setHelpText('')
    setHelpError(null)
    setIsModalOpen(false)
  }

  const changeLanguage = (language: 'en' | 'ar') => {
    dispatch(setLanguage(language))
  }

  const renderStep = () => {
    switch (application.currentStep) {
      case 1:
        return <Step1 register={register} setValue={setValue} getValues={getValues} errors={formState.errors} />
      case 2:
        return <Step2 register={register} errors={formState.errors} />
      default:
        return <Step3 register={register} errors={formState.errors} onHelp={openHelp} loadingField={helpLoading ? helpField : null} />
    }
  }

  const stepContainerVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -40, scale: 0.98 },
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

        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span>{t('progress')}</span>
            <strong>{t('step', { count: application.currentStep })}</strong>
          </div>
          <ProgressBar currentStep={application.currentStep} />
        </div>

        <form className={styles.formWrapper} onSubmit={handleSubmit(handleSubmitApplication)}>
          <section aria-labelledby="step-heading" className={styles.stepSection}>
            <h2 id="step-heading" className={styles.stepHeading}>
              {t(stepLabels[application.currentStep - 1])}
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${application.currentStep}-${application.language}`}
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

          <StepNavigation
            currentStep={application.currentStep}
            canGoBack={application.currentStep > 1}
            isSubmitting={application.submitStatus === 'submitting'}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit(handleSubmitApplication)}
          />
        </form>
      </motion.section>

      {toastMessage ? (
        <div className={`${styles.toast} ${toastType === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toastMessage}
        </div>
      ) : null}

        <AIHelpModal
          visible={isModalOpen}
          title={t('suggestions')}
          value={helpText}
          loading={helpLoading}
          error={helpError ?? undefined}
          onClose={handleDiscard}
          onAccept={handleAccept}
          onDiscard={handleDiscard}
          onChange={(value) => setHelpText(value)}
        />
    </main>
  )
}

