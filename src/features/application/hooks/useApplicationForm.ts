// Application feature hooks.
// Encapsulates form and UI state behavior for the application feature.

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
  setLanguage,
  setStep,
  setSubmitError,
  setSubmitStatus,
  submitApplicationAsync,
  updateForm,
} from '../stores'
import { aiSuggestionService } from '../services/AiSuggestionService'
import { htmlDecode } from '../../../shared/helpers/htmlDecode'
import { defaultForm, type ApplicationFormValues, type ApplicationStep } from '../models/applicationTypes'

const stepFields: Record<ApplicationStep, Array<keyof ApplicationFormValues>> = {
  1: ['name', 'nationalId', 'dateOfBirth', 'gender', 'address', 'city', 'state', 'countryCode', 'phone', 'email'],
  2: ['maritalStatus', 'dependents', 'employmentStatus', 'monthlyIncome', 'housingStatus'],
  3: ['financialSituation', 'employmentCircumstances', 'applicationReason'],
}

const stepContainerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -40, scale: 0.98 },
}

export const useApplicationForm = () => {
  const dispatch = useAppDispatch()
  const application = useAppSelector((state) => state.application)
  const { t, i18n } = useTranslation()

  const [helpField, setHelpField] = useState<keyof ApplicationFormValues | null>(null)
  const [helpText, setHelpText] = useState('')
  const [helpLoading, setHelpLoading] = useState(false)
  const [helpError, setHelpError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastDismissed, setToastDismissed] = useState(false)

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

  const toastMessage = useMemo(() => {
    if (application.submitStatus === 'success') return t('submissionSuccess')
    if (application.submitStatus === 'failed') return application.submitError ?? t('submissionError')
    return ''
  }, [application.submitStatus, application.submitError, t])

  const toastType = useMemo(() => {
    if (application.submitStatus === 'success') return 'success'
    if (application.submitStatus === 'failed') return 'error'
    return ''
  }, [application.submitStatus])

  useEffect(() => {
    if (!toastMessage) {
      return undefined
    }

    const resetTimeout = window.setTimeout(() => {
      setToastDismissed(false)
    }, 0)

    const visibilityTimeout = window.setTimeout(() => {
      setToastDismissed(true)
    }, 4000)

    return () => {
      window.clearTimeout(resetTimeout)
      window.clearTimeout(visibilityTimeout)
    }
  }, [toastMessage])

  const currentFields = useMemo(() => stepFields[application.currentStep], [application.currentStep])

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
    dispatch(setStep((application.currentStep + 1) as ApplicationStep))
  }

  const handleBack = () => {
    dispatch(setStep((application.currentStep - 1) as ApplicationStep))
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
      const suggestion = await aiSuggestionService.generateSuggestion(field, values)
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

    setIsModalOpen(false)
    setTimeout(() => {
      let appliedText = helpText

      if (helpField === 'employmentCircumstances' || helpField === 'financialSituation') {
        const quoted = helpText.match(/['"“”]([^'"“”]+)['"“”]/u)
        if (quoted && quoted[1]) {
          appliedText = quoted[1].trim()
        } else {
          const single = helpText.match(/'([^']+)'/)
          if (single && single[1]) {
            appliedText = single[1].trim()
          } else {
            const colonMatch = helpText.match(/(?:You could say:|The given description is:|You could try:|consider:\s*)([\s\S]+)/i)
            if (colonMatch && colonMatch[1]) {
              let candidate = colonMatch[1].trim()
              const qIndex = candidate.indexOf('?')
              if (qIndex !== -1) candidate = candidate.slice(0, qIndex)
              candidate = candidate.replace(/^['"“”`\s]+|['"“”`\s]+$/g, '')
              const sentences = candidate.split(/[.\n]+/).map((s) => s.trim()).filter(Boolean)
              if (sentences.length) appliedText = sentences[0]
            } else {
              const qIndex2 = appliedText.lastIndexOf('?')
              if (qIndex2 !== -1) {
                const before = appliedText.slice(0, qIndex2 + 1)
                const sentences = before.split(/[.\n]+/).map((s) => s.trim()).filter(Boolean)
                if (sentences.length) appliedText = sentences[sentences.length - 1]
              }
            }
          }
        }
      }

      setValue(helpField, appliedText, { shouldDirty: true, shouldTouch: true })
      dispatch(updateForm({ [helpField]: appliedText }))

      setTimeout(() => {
        try {
          const el = document.querySelector(`textarea[name="${String(helpField)}"]`) as HTMLTextAreaElement | null
          if (el) {
            el.value = appliedText
            el.dispatchEvent(new Event('input', { bubbles: true }))
            el.focus()
          }
        } catch {
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

  return {
    application,
    helpField,
    helpText,
    helpLoading,
    helpError,
    isModalOpen,
    toastMessage,
    toastType,
    toastDismissed,
    currentStep: application.currentStep,
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    setHelpText,
    formState,
    reset,
    stepContainerVariants,
    handleNext,
    handleBack,
    handleSubmitApplication,
    openHelp,
    handleAccept,
    handleDiscard,
    changeLanguage,
  }
}
