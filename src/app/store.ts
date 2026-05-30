// Redux store configuration and persistence wiring for the application state.
import { configureStore } from '@reduxjs/toolkit'
import { applicationReducer } from '../features/application/stores'
import { countriesReducer } from '../features/countries/stores'
import { loadPersistedState, savePersistedState } from '../global/services/storageService'

const preloadedState = loadPersistedState()

export const store = configureStore({
  reducer: {
    application: applicationReducer,
    countries: countriesReducer,
  },
  preloadedState,
})

store.subscribe(() => {
  savePersistedState(store.getState())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

