import { useCallback, useMemo } from 'react'
import type { FieldErrors, UseFormGetValues, UseFormTrigger } from 'react-hook-form'
import type { TFunction } from 'i18next'
import type { AppDispatch } from '../../../app/store'
import type { AidFormStep, AidFormValues } from '../types/aidFormTypes'
import { stepDefinitions } from '../stepDefinitions'
import { setStep, updateForm } from '../stores'
import { getFirstErrorMessage, validateFields } from '../utils/formValidation'

interface UseStepNavigationParams {
  currentStep: AidFormStep
  dispatch: AppDispatch
  trigger: UseFormTrigger<AidFormValues>
  getValues: UseFormGetValues<AidFormValues>
  getCurrentErrors: () => FieldErrors<AidFormValues>
  t: TFunction
  showToast: (message: string, type?: 'success' | 'error') => void
}

export function useStepNavigation({
  currentStep,
  dispatch,
  trigger,
  getValues,
  getCurrentErrors,
  t,
  showToast,
}: UseStepNavigationParams) {
  const currentStepDefinition = useMemo(() => stepDefinitions[currentStep], [currentStep])
  const currentFields = currentStepDefinition.fields
  const stepTitle = currentStepDefinition.title
  const currentFieldNames = useMemo(
    () => currentFields as Array<keyof AidFormValues>,
    [currentFields],
  )

  const saveProgress = useCallback(() => {
    dispatch(updateForm(getValues()))
  }, [dispatch, getValues])

  const getCurrentFieldValues = useCallback(
    () => getValues() as AidFormValues,
    [getValues],
  )

  const handleInvalidSubmit = useCallback(async () => {
    const isValid = await trigger(currentFieldNames)
    const refreshedErrors = getCurrentErrors()
    const values = getCurrentFieldValues()
    const message = getFirstErrorMessage(values, currentFields, refreshedErrors, t)

    // (no-op) handled by UI toast

    if (!isValid) {
      showToast(message || t('pleaseFixErrors'), 'error')
    }
  }, [currentFields, currentFieldNames, currentStep, getCurrentErrors, getCurrentFieldValues, showToast, t, trigger])

  const handleNext = useCallback(async () => {
    const values = getCurrentFieldValues()

    // pre-validate by values before triggering RHF validation

    // First validate by actual values to ensure required fields are present
    // This prevents advancing when complex widgets haven't written their
    // values into RHF state yet.
    const validationResult = validateFields(values, currentFields, t)
    if (!validationResult.valid) {
      const message = getFirstErrorMessage(values, currentFields, getCurrentErrors(), t)
      showToast(message || t('pleaseFixErrors'), 'error')
      return
    }

    // Now run RHF's trigger for pattern/format validations
    const isValid = await trigger(currentFieldNames)
    if (isValid) {
      saveProgress()
      dispatch(setStep((currentStep + 1) as AidFormStep))
      return
    }

    const currentErrors = getCurrentErrors()
    const message = getFirstErrorMessage(values, currentFields, currentErrors, t)
    showToast(message || t('pleaseFixErrors'), 'error')
  }, [currentStep, currentFields, currentFieldNames, dispatch, getCurrentErrors, getCurrentFieldValues, saveProgress, showToast, t, trigger])

  const handleBack = useCallback(() => {
    dispatch(setStep((currentStep - 1) as AidFormStep))
  }, [currentStep, dispatch])

  return {
    currentFields,
    stepTitle,
    handleInvalidSubmit,
    handleNext,
    handleBack,
  }
}
