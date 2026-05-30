// Global services.
// Holds cross-cutting services like persistence adapters.

import type { ApplicationState } from '../../features/application/models/applicationTypes'
import type { CountriesState } from '../../features/countries/stores/countriesSlice'

const STORAGE_KEY = 'socialAidPersistedState'

export interface PersistedState {
  application: ApplicationState
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
    return {
      ...persisted,
      application: {
        ...persisted.application,
        submitStatus: 'idle',
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
      application: {
        ...state.application,
        submitStatus: 'idle',
        submitError: null,
      },
      countries: state.countries,
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedState))
  } catch {
    // Ignore write errors in browsers with disabled storage.
  }
}
