import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { setLanguage } from '../stores'
import { useStepNavigation } from './useStepNavigation'
import { useAiSuggestion } from './useAiSuggestion'
import { useFormSubmission } from './useFormSubmission'
import { useLanguageSync } from './useLanguageSync'
import { useToast } from './useToast'
import { FORM_VALIDATION_MODE, FORM_REVALIDATE_MODE } from '../../../shared/constants'
import { AID_FORM_SUBMIT_STATUS } from '../types/aidFormTypes'
import type { AidFormLanguage, AidFormValues } from '../types/aidFormTypes'


export function useAidForm() {
  const dispatch = useAppDispatch()
  const aidForm = useAppSelector((state) => state.aidForm)
  const countriesState = useAppSelector((state) => state.countries)
  const { t, i18n } = useTranslation()
  const { toast, showToast, dismissToast } = useToast()

  const {
    register,
    handleSubmit,
    trigger,
    control,
    getValues,
    setValue,
    reset,
    formState,
    clearErrors,
  } = useForm<AidFormValues>({
    mode: FORM_VALIDATION_MODE,
    reValidateMode: FORM_REVALIDATE_MODE,
    defaultValues: aidForm.form,
    shouldUnregister: false,
  })

  // (debugging helpers removed)

  useEffect(() => {
    reset(aidForm.form)
  }, [])  // Only reset on mount, not on every aidForm.form change


  useLanguageSync(aidForm.language, i18n)

  const getCurrentErrors = useCallback(() => formState.errors, [formState.errors])

  const { currentFields, stepTitle, handleInvalidSubmit, handleNext, handleBack } = useStepNavigation({
    currentStep: aidForm.currentStep,
    dispatch,
    trigger,
    getValues,
    getCurrentErrors,
    t,
    showToast,
  })

  const {
    helpField,
    helpText,
    setHelpText,
    helpLoading,
    helpError,
    isModalOpen,
    openSuggestion,
    handleAcceptSuggestion,
    handleDiscardSuggestion,
    resetSuggestionState,
  } = useAiSuggestion({
    getValues,
    setValue,
    t,
  })

  const isSubmitting = aidForm.submitStatus === AID_FORM_SUBMIT_STATUS.submitting

  const handleSubmitAidForm = useFormSubmission({
    dispatch,
    trigger,
    getValues,
    reset,
    t,
    countries: countriesState.items,
    showToast,
    resetSuggestionState,
  })

  const changeLanguage = useCallback(
    (language: AidFormLanguage) => {
      dispatch(setLanguage(language))
    },
    [dispatch],
  )

  return {
    aidForm,
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState,
    clearErrors,
    currentFields,
    stepTitle,
    currentStep: aidForm.currentStep,
    isSubmitting,
    helpField,
    helpText,
    helpLoading,
    helpError,
    isModalOpen,
    toast,
    handleDismissToast: dismissToast,
    handleInvalidSubmit,
    handleNext,
    handleBack,
    handleSubmitAidForm,
    openSuggestion,
    handleAcceptSuggestion,
    handleDiscardSuggestion,
    setHelpText,
    changeLanguage,
    control,
  }
}
