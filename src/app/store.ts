// Redux store configuration and persistence wiring for the aidForm state.
import { configureStore } from '@reduxjs/toolkit'
import { aidFormReducer } from '../features/aidForms/stores'
import { countriesReducer } from '../features/countries/stores'
import { loadPersistedState, savePersistedState } from '../shared/services/storageService'

const preloadedState = loadPersistedState()

export const store = configureStore({
  reducer: {
    aidForm: aidFormReducer,
    countries: countriesReducer,
  },
  preloadedState,
})

store.subscribe(() => {
  savePersistedState(store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch




