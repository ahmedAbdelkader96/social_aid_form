// LocalStorage persistence helper for aidForm state.
// This module safely loads and saves the Redux state between sessions.
import type { AidFormState } from '../../features/aidForms/types/aidFormTypes'
import { AID_FORM_SUBMIT_STATUS } from '../../features/aidForms/types/aidFormTypes'
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

    const persisted = parsed as PersistedState

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

    const sanitizedAidForm = {
      ...persisted.aidForm,
      form: {
        ...((persisted.aidForm && (persisted.aidForm as any).form) || {}),
        nationalId: sanitizeValue((persisted.aidForm as any)?.form?.nationalId),
        phone: sanitizeValue((persisted.aidForm as any)?.form?.phone),
      },
    }

    return {
      ...persisted,
      aidForm: {
        ...sanitizedAidForm,
        submitStatus: AID_FORM_SUBMIT_STATUS.idle,
        submitError: null,
      },
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



