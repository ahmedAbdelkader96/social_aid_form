import { useCallback } from 'react'
import type { UseFormGetValues, UseFormReset, UseFormTrigger } from 'react-hook-form'
import type { TFunction } from 'i18next'
import type { AppDispatch } from '../../../app/store'
import type CountryModel from '../../countries/models/CountryModel'
import type { AidFormValues } from '../types/aidFormTypes'
import { AID_FORM_STEP, defaultAidForm } from '../types/aidFormTypes'
import { normalizeAidFormPayload } from '../utils/normalizeAidFormPayload'
import { clearPersistedState } from '../../../shared/services/storageService'
import { getFirstErrorMessage, validateFields } from '../utils/formValidation'
import { setStep, setSubmitError, updateForm, submitAidFormAsync } from '../stores'

interface UseFormSubmissionParams {
  dispatch: AppDispatch
  trigger: UseFormTrigger<AidFormValues>
  getValues: UseFormGetValues<AidFormValues>
  reset: UseFormReset<AidFormValues>
  t: TFunction
  countries: CountryModel[]
  showToast: (message: string, type?: 'success' | 'error') => void
  resetSuggestionState: () => void
}

export function useFormSubmission({
  dispatch,
  trigger,
  getValues,
  reset,
  t,
  countries,
  showToast,
  resetSuggestionState,
}: UseFormSubmissionParams) {
  return useCallback(
    async () => {
      const allFields = Object.keys(defaultAidForm) as Array<keyof AidFormValues>
      const isValid = await trigger(allFields)

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
        // Clear stored cache completely and reset both RHF and redux form state.
        clearPersistedState()
        reset(defaultAidForm)
        dispatch(updateForm(defaultAidForm))
        dispatch(setStep(AID_FORM_STEP.step1))
        resetSuggestionState()
        showToast(t('submissionSuccess'), 'success')
      }
    },
    [countries, dispatch, getValues, resetSuggestionState, showToast, t, trigger],
  )
}
