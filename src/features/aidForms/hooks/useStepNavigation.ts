import { useCallback, useMemo } from 'react'
import type { FieldErrors, UseFormGetValues, UseFormTrigger } from 'react-hook-form'
import type { TFunction } from 'i18next'
import type { AppDispatch } from '../../../app/store'
import type { AidFormStep, AidFormValues } from '../types/aidFormTypes'
import { stepDefinitions } from '../stepDefinitions'
import { setStep, updateForm } from '../stores'
import { getFirstErrorMessage } from '../utils/formValidation'

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

  const saveProgress = useCallback(() => {
    dispatch(updateForm(getValues()))
  }, [dispatch, getValues])

  const getCurrentFieldValues = useCallback(() => {
    const readDomValue = (name: string) => {
      try {
        const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${name}"]`)
        if (el) return el.value
      } catch {
        // ignore
      }
      return undefined
    }

    return currentFields.reduce((acc, field) => {
      const val = getValues(field)
      const fallback = val === undefined || val === null || String(val) === '' ? readDomValue(field) : val
      return { ...acc, [field]: fallback ?? val } as Partial<AidFormValues>
    }, {} as Partial<AidFormValues>) as AidFormValues
  }, [currentFields, getValues])

  const handleInvalidSubmit = useCallback(() => {
    // Ensure we trigger validations for each field in order so RHF state is fresh
    void (async () => {
      for (const f of currentFields) {
        await trigger(f as unknown as keyof AidFormValues)
      }

      const refreshedErrors = getCurrentErrors()

      // Re-read current values after triggers so validation uses fresh input
      const values = getCurrentFieldValues()
      const message = getFirstErrorMessage(values, currentFields, refreshedErrors, t)
      showToast(message || t('pleaseFixErrors'), 'error')
    })()
  }, [currentFields, currentFields.length, getCurrentErrors, getCurrentFieldValues, showToast, t, trigger])

  const handleNext = useCallback(async () => {

    // Trigger validations sequentially to ensure the order matches the UI grid
    let isValid = true
    for (const f of currentFields) {
       
       
      const ok = await trigger(f as unknown as keyof AidFormValues)
      if (!ok) isValid = false
    }

    if (isValid) {
      saveProgress()
      dispatch(setStep((currentStep + 1) as AidFormStep))
      return
    }

    // allow RHF state to settle then compute message from refreshed errors
    await new Promise((resolve) => setTimeout(resolve, 0))
    const currentErrors = getCurrentErrors()
    const values = getCurrentFieldValues()
    const message = getFirstErrorMessage(values, currentFields, currentErrors, t)
    showToast(message || t('pleaseFixErrors'), 'error')
  }, [currentStep, currentFields, dispatch, getCurrentErrors, getCurrentFieldValues, saveProgress, showToast, t, trigger])

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
