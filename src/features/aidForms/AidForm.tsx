// Main aidForm form component orchestrating feature steps and submission flow.
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { showToast, subscribeToast } from '../../shared/services/toastService'
import type { ToastPayload } from '../../shared/services/toastService'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import SelectMenu from '../../shared/ui/SelectMenu'
import {
  setLanguage,
  setStep,
  setSubmitError,
  setSubmitStatus,
  submitAidFormAsync,
  updateForm,
} from './stores'
import { generateAISuggestion } from '../../shared/api/aiClient'
import { ProgressBar } from './components/ProgressBar'
import { StepNavigation } from './components/StepNavigation'
import { AIHelpModal } from './components/AIHelpModal'
import { Step1 } from './components/Step1'
import { Step2 } from './components/Step2'
import { Step3 } from './components/Step3'
import { AID_FORM_FIELD, AID_FORM_LANGUAGE, AID_FORM_STEP, AID_FORM_SUBMIT_STATUS, defaultAidForm, AID_FORM_GENDER, AID_FORM_MARITAL_STATUS, AID_FORM_EMPLOYMENT_STATUS, AID_FORM_HOUSING_STATUS } from './types/aidFormTypes'
import { parseAiSuggestion } from './utils/parseAiSuggestion'
import { validateFields } from './utils/formValidation'
import type { AidFormValues, AidFormLanguage, AidFormStep, HelpField } from './types/aidFormTypes'
import styles from './styles/AidForm.module.css'

const stepLabels = ['personalInformation', 'familyFinancialInfo', 'situationDescriptions'] as const

export const AidForm = () => {
  const dispatch = useAppDispatch()
  const aidForm = useAppSelector((state) => state.aidForm)
  const countriesState = useAppSelector((state) => state.countries)
  const { t, i18n } = useTranslation()
  const [helpField, setHelpField] = useState<HelpField | null>(null)
  const [helpText, setHelpText] = useState('')
  const [helpLoading, setHelpLoading] = useState(false)
  const [helpError, setHelpError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState<ToastPayload | null>(null)

  const handleDismissToast = () => {
    setToast(null)
  }

  const { register, handleSubmit, trigger, watch, getValues, setValue, formState, reset, clearErrors } = useForm<AidFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: aidForm.form,
  })

  useEffect(() => {
    reset(aidForm.form)
  }, [aidForm.form, reset])

  useEffect(() => {
    i18n.changeLanguage(aidForm.language)
    document.documentElement.dir = aidForm.language === 'ar' ? 'rtl' : 'ltr'
  }, [aidForm.language, i18n])

  useEffect(() => {
    if (aidForm.submitStatus === AID_FORM_SUBMIT_STATUS.success) {
      const id = window.setTimeout(() => {
        showToast(t('submissionSuccess'), 'success')
      }, 0)
      return () => window.clearTimeout(id)
    }

    if (aidForm.submitStatus === AID_FORM_SUBMIT_STATUS.failed) {
      const id = window.setTimeout(() => {
        showToast(aidForm.submitError ?? t('submissionError'), 'error')
      }, 0)
      return () => window.clearTimeout(id)
    }

    return undefined
  }, [aidForm.submitStatus, aidForm.submitError, t])

  const currentFields = useMemo(() => {
    switch (aidForm.currentStep) {
      case AID_FORM_STEP.step1:
        return [
          AID_FORM_FIELD.name,
          AID_FORM_FIELD.nationalId,
          AID_FORM_FIELD.dateOfBirth,
          AID_FORM_FIELD.gender,
          AID_FORM_FIELD.phone,
          AID_FORM_FIELD.countryCode,
          AID_FORM_FIELD.dialCode,
          AID_FORM_FIELD.address,
          AID_FORM_FIELD.state,
          AID_FORM_FIELD.city,
          AID_FORM_FIELD.email,
        ] as const
      case AID_FORM_STEP.step2:
        return [
          AID_FORM_FIELD.maritalStatus,
          AID_FORM_FIELD.dependents,
          AID_FORM_FIELD.employmentStatus,
          AID_FORM_FIELD.monthlyIncome,
          AID_FORM_FIELD.housingStatus,
        ] as const
      default:
        return [
          AID_FORM_FIELD.financialSituation,
          AID_FORM_FIELD.employmentCircumstances,
          AID_FORM_FIELD.applicationReason,
        ] as const
    }
  }, [aidForm.currentStep])

  const watchedValues = watch(currentFields as readonly (keyof AidFormValues)[])

  useEffect(() => {
    if (!watchedValues || !clearErrors) return
    currentFields.forEach((field, index) => {
      const value = (watchedValues as unknown[])[index]
      if (value !== undefined && value !== null && String(value).trim() !== '' && formState.errors[field]) {
        clearErrors(field)
      }
    })
  }, [watchedValues, currentFields, clearErrors, formState.errors])

  const saveProgress = () => {
    const values = getValues()
    dispatch(updateForm(values))
  }

  useEffect(() => {
    const unsubscribe = subscribeToast(setToast)
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(id)
  }, [toast])

  const handleInvalidSubmit = () => {
    const values = getValues() as AidFormValues
    const { valid, errors, firstField } = validateFields(values, currentFields, t)
    if (!valid && firstField) {
      showToast(errors[firstField as string], 'error')
      return
    }

    // Fallback to react-hook-form errors (pattern-specific messages)
    for (const field of currentFields) {
      const error = formState.errors[field]
      if (!error) continue
      const message = error.type === 'pattern'
        ? ((error.message as string) || t('fieldRequired', { field: t(field) }))
        : t('fieldRequired', { field: t(field) })
      showToast(message, 'error')
      return
    }

    showToast(t('pleaseFixErrors'), 'error')
  }

  const handleNext = async () => {
    // First trigger react-hook-form validation to ensure it reads the latest DOM values
    // (this avoids stale reads from `getValues` when the user types and immediately clicks Next).
    const triggerValid = await trigger(currentFields)
    if (!triggerValid) {
      handleInvalidSubmit()
      return
    }

    const values = getValues() as AidFormValues

    // Run centralized validation
    const { valid: fieldsValid, errors, firstField } = validateFields(values, currentFields, t)
    if (!fieldsValid && firstField) {
      showToast(errors[firstField as string], 'error')
      return
    }

    // If RHF still reports invalid (pattern constraints), show those
    const rhfValid = await trigger(currentFields)
    if (!rhfValid) {
      for (const field of currentFields) {
        const error = formState.errors[field]
        if (!error) continue
        const message = error.type === 'pattern'
          ? ((error.message as string) || t('fieldRequired', { field: t(field) }))
          : t('fieldRequired', { field: t(field) })
        showToast(message, 'error')
        return
      }
      showToast(t('pleaseFixErrors'), 'error')
      return
    }

    await saveProgress()
    dispatch(setStep((aidForm.currentStep + 1) as AidFormStep))
  }

  const handleBack = () => {
    dispatch(setStep((aidForm.currentStep - 1) as AidFormStep))
  }

  const handleSubmitAidForm = async (values: AidFormValues) => {
    // Ensure all form fields (across all steps) are validated before submitting.
    const allFields = Object.keys(defaultAidForm) as (keyof AidFormValues)[]
    const allValid = await trigger(allFields)
    if (!allValid) {
      handleInvalidSubmit()
      return
    }

    // Normalize phone: combine selected country dial code with phone input if needed.
    const countries = countriesState.items || []
    const payload: any = { ...values }

    const cleanNumber = (s?: string) => (s ? String(s).replace(/[^0-9]/g, '') : '')

    // If user selected a countryCode, prefer that country's dialCode
    if (payload.countryCode) {
      const country = countries.find((c: any) => c.code === payload.countryCode)
      if (country && country.dialCode) payload.dialCode = country.dialCode
    }

    // If phone already contains a leading + keep it, otherwise prefix with dialCode if available
    const rawPhone = String(payload.phone ?? '').trim()
    if (rawPhone) {
      if (rawPhone.startsWith('+')) {
        payload.phone = rawPhone.replace(/\s+/g, '')
      } else if (payload.dialCode) {
        const dialClean = payload.dialCode.replace(/[^0-9+]/g, '')
        const merged = `${dialClean}${cleanNumber(rawPhone)}`
        payload.phone = merged
      } else {
        // no dial code available, sanitize phone
        payload.phone = `+${cleanNumber(rawPhone)}`
      }
    }

    // Map select enum values to API canonical English labels to satisfy backend validation
    const canonicalGenderMap: Record<string, string> = {
      [AID_FORM_GENDER.female]: 'Female',
      [AID_FORM_GENDER.male]: 'Male',
      [AID_FORM_GENDER.other]: 'Other',
    }

    const canonicalMaritalMap: Record<string, string> = {
      [AID_FORM_MARITAL_STATUS.single]: 'Single',
      [AID_FORM_MARITAL_STATUS.married]: 'Married',
      [AID_FORM_MARITAL_STATUS.divorced]: 'Divorced',
      [AID_FORM_MARITAL_STATUS.widowed]: 'Widowed',
    }

    const canonicalEmploymentMap: Record<string, string> = {
      [AID_FORM_EMPLOYMENT_STATUS.employed]: 'Employed',
      [AID_FORM_EMPLOYMENT_STATUS.unemployed]: 'Unemployed',
      [AID_FORM_EMPLOYMENT_STATUS.selfEmployed]: 'Self-Employed',
      [AID_FORM_EMPLOYMENT_STATUS.student]: 'Student',
    }

    const canonicalHousingMap: Record<string, string> = {
      [AID_FORM_HOUSING_STATUS.renting]: 'Rented',
      [AID_FORM_HOUSING_STATUS.owning]: 'Owned',
      [AID_FORM_HOUSING_STATUS.livingWithFamily]: 'Living with family',
      [AID_FORM_HOUSING_STATUS.temporaryShelter]: 'Temporary shelter',
    }

    if (payload.gender && canonicalGenderMap[payload.gender]) payload.gender = canonicalGenderMap[payload.gender]
    if (payload.maritalStatus && canonicalMaritalMap[payload.maritalStatus]) payload.maritalStatus = canonicalMaritalMap[payload.maritalStatus]
    if (payload.employmentStatus && canonicalEmploymentMap[payload.employmentStatus]) payload.employmentStatus = canonicalEmploymentMap[payload.employmentStatus]
    if (payload.housingStatus && canonicalHousingMap[payload.housingStatus]) payload.housingStatus = canonicalHousingMap[payload.housingStatus]

    // Remove dialCode from payload (backend expects a single `phone` value)
    delete payload.dialCode

    dispatch(updateForm(payload))
    dispatch(setSubmitStatus(AID_FORM_SUBMIT_STATUS.submitting))
    dispatch(setSubmitError(null))
    const resultAction = await dispatch(submitAidFormAsync(payload))

    if (submitAidFormAsync.rejected.match(resultAction)) {
      dispatch(setSubmitStatus(AID_FORM_SUBMIT_STATUS.failed))
      const errorMessage = resultAction.payload ?? resultAction.error.message ?? 'Unable to submit aid form.'
      dispatch(setSubmitError(errorMessage))
      showToast(errorMessage, 'error')
      return
    }

    if (submitAidFormAsync.fulfilled.match(resultAction)) {
      dispatch(updateForm(defaultAidForm))
      dispatch(setStep(AID_FORM_STEP.step1))
      setHelpField(null)
      setHelpText('')
      setHelpError(null)
      setIsModalOpen(false)
      showToast(t('submissionSuccess'), 'success')
    }
  }

  const openHelp = async (field: HelpField) => {
    setHelpField(field)
    setHelpText('')
    setHelpError(null)
    setHelpLoading(true)
    setIsModalOpen(true)
    try {
      const values = getValues()
      const suggestion = await generateAISuggestion(field, values as unknown)
      // To test without decoding HTML entities, use: setHelpText(suggestion)
      // setHelpText(htmlDecode(suggestion))
            setHelpText(suggestion)

    } catch (error) {
      setHelpError(error instanceof Error ? error.message : 'Unable to generate suggestion.')
    } finally {
      setHelpLoading(false)
    }
  }

  const handleAccept = () => {
    if (!helpField) return

    const appliedText = parseAiSuggestion(helpText, helpField)
    setValue(helpField, appliedText, { shouldDirty: true, shouldTouch: true })
    dispatch(updateForm({ [helpField]: appliedText } as Partial<AidFormValues>))
    setIsModalOpen(false)
  }

  const handleDiscard = () => {
    setHelpText('')
    setHelpError(null)
    setIsModalOpen(false)
  }

  const changeLanguage = (language: AidFormLanguage) => {
    dispatch(setLanguage(language))
  }

  const renderStep = () => {
    switch (aidForm.currentStep) {
      case AID_FORM_STEP.step1:
        return <Step1 register={register} setValue={setValue} getValues={getValues} errors={formState.errors} trigger={trigger} clearErrors={clearErrors} />
      case AID_FORM_STEP.step2:
        return <Step2 register={register} errors={formState.errors} trigger={trigger} clearErrors={clearErrors} />
      default:
        return <Step3 register={register} errors={formState.errors} onHelp={openHelp} loadingField={helpLoading ? helpField : null} trigger={trigger} clearErrors={clearErrors} />
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
            {/* Reusable select menu */}
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
            <strong>{t('step', { count: aidForm.currentStep })}</strong>
          </div>
          <ProgressBar currentStep={aidForm.currentStep} />
        </div>

        <form className={styles.formWrapper} onSubmit={handleSubmit(handleSubmitAidForm, handleInvalidSubmit)} autoComplete="off">
          <section aria-labelledby="step-heading" className={styles.stepSection}>
            <h2 id="step-heading" className={styles.stepHeading}>
              {t(stepLabels[aidForm.currentStep - 1])}
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={aidForm.currentStep}
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
            currentStep={aidForm.currentStep}
            canGoBack={aidForm.currentStep > 1}
            isSubmitting={aidForm.submitStatus === AID_FORM_SUBMIT_STATUS.submitting}
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


