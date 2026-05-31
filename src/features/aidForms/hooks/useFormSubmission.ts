import { useCallback } from 'react'
import type { UseFormGetValues, UseFormTrigger } from 'react-hook-form'
import type { TFunction } from 'i18next'
import type { AppDispatch } from '../../../app/store'
import type CountryModel from '../../countries/models/CountryModel'
import type { AidFormValues } from '../types/aidFormTypes'
import { AID_FORM_STEP, defaultAidForm } from '../types/aidFormTypes'
import { normalizeAidFormPayload } from '../utils/normalizeAidFormPayload'
import { getFirstErrorMessage, validateFields } from '../utils/formValidation'
import { setStep, setSubmitError, updateForm, submitAidFormAsync } from '../stores'

interface UseFormSubmissionParams {
  dispatch: AppDispatch
  trigger: UseFormTrigger<AidFormValues>
  getValues: UseFormGetValues<AidFormValues>
  t: TFunction
  formErrors: Record<string, unknown>
  countries: CountryModel[]
  showToast: (message: string, type?: 'success' | 'error') => void
  resetSuggestionState: () => void
}

export function useFormSubmission({
  dispatch,
  trigger,
  getValues,
  t,
  formErrors,
  countries,
  showToast,
  resetSuggestionState,
}: UseFormSubmissionParams) {
  return useCallback(
    async () => {
      const allFields = Object.keys(defaultAidForm) as (keyof AidFormValues)[]
      // Trigger each field sequentially to ensure last input changes are registered
      let isValid = true
      for (const f of allFields) {
         
        const ok = await trigger(f)
        if (!ok) isValid = false
      }

      const freshValues = getValues()
      const { valid: fieldsValid } = validateFields(freshValues as AidFormValues, allFields, t)

      if (!isValid || !fieldsValid) {
        showToast(getFirstErrorMessage(freshValues as AidFormValues, allFields, {}, t), 'error')
        return
      }

      const payload = normalizeAidFormPayload(freshValues as AidFormValues, countries)
      dispatch(updateForm(payload))
      dispatch(setSubmitError(null))

      const resultAction = await dispatch(submitAidFormAsync(payload as unknown as AidFormValues))
      if (submitAidFormAsync.rejected.match(resultAction)) {
        const errorMessage = resultAction.payload ?? resultAction.error.message ?? t('submissionError')
        dispatch(setSubmitError(errorMessage))
        showToast(errorMessage, 'error')
        return
      }

      if (submitAidFormAsync.fulfilled.match(resultAction)) {
        dispatch(updateForm(defaultAidForm))
        dispatch(setStep(AID_FORM_STEP.step1))
        resetSuggestionState()
        showToast(t('submissionSuccess'), 'success')
      }
    },
    [countries, dispatch, formErrors, getValues, resetSuggestionState, showToast, t, trigger],
  )
}
