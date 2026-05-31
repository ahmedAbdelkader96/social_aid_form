// LocalStorage persistence helper for aidForm state.
// This module safely loads and saves the Redux state between sessions.
import type { AidFormState } from '../../features/aidForms/types/aidFormTypes'
import { AID_FORM_SUBMIT_STATUS, AID_FORM_STEP, AID_FORM_LANGUAGE, defaultAidForm } from '../../features/aidForms/types/aidFormTypes'
import type { CountriesState } from '../../features/countries/stores/countriesSlice'
import { STORAGE_KEY } from '../constants'

export interface PersistedState {
  aidForm: AidFormState
  countries: CountriesState
}

export function loadPersistedState(): PersistedState | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return undefined
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return undefined
    }

    const persisted = parsed as unknown as Partial<PersistedState>
    const persistedAidForm = persisted.aidForm as Partial<AidFormState> | undefined
    const persistedForm = persistedAidForm?.form as Partial<AidFormState['form']> | undefined

    // Sanitize suspicious persisted fields that may come from autofill or stale data.
    const sanitizeValue = (val: unknown) => {
      if (val === undefined || val === null) return ''
      if (typeof val === 'number') return ''
      if (typeof val === 'string') {
        const digitsOnly = /^\d{9,}$/
        if (digitsOnly.test(val.replace(/\s|[-+()]/g, ''))) {
          // Very long digit-only strings are likely stale/autofill; clear them
          if (val.replace(/\D/g, '').length > 12) return ''
        }
        return val
      }
      return ''
    }

    const sanitizedAidForm: AidFormState = {
      currentStep: persistedAidForm?.currentStep ?? AID_FORM_STEP.step1,
      language: persistedAidForm?.language ?? AID_FORM_LANGUAGE.en,
      form: {
        ...defaultAidForm,
        ...(persistedForm ?? {}),
        nationalId: sanitizeValue(persistedForm?.nationalId),
        phone: sanitizeValue(persistedForm?.phone),
      },
      submitStatus: AID_FORM_SUBMIT_STATUS.idle,
      submitError: null,
    }

    const defaultCountries: CountriesState = {
      items: [],
      locale: AID_FORM_LANGUAGE.en,
      status: 'idle',
      error: null,
      lastFetchedAt: null,
    }

    return {
      aidForm: sanitizedAidForm,
      countries: persisted.countries ?? defaultCountries,
    }
  } catch {
    return undefined
  }
}

export function savePersistedState(state: PersistedState): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const sanitizedState: PersistedState = {
      aidForm: {
        ...state.aidForm,
        form: {
          ...state.aidForm.form,
          nationalId: '',
          phone: '',
        },
        submitStatus: AID_FORM_SUBMIT_STATUS.idle,
        submitError: null,
      },
      countries: state.countries,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedState))
  } catch {
    // Ignore write errors in browsers with disabled storage.
  }
}



