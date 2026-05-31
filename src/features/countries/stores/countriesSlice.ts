// Countries feature Redux slice for loading and storing normalized country lookup data.
// Keeps remote country loading separate from form presentation logic.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import CountriesController from '../controller/CountriesController'
import CountryModel from '../models/CountryModel'
import { AID_FORM_LANGUAGE } from '../../aidForms/types/aidFormTypes'
import { ASYNC_STATUS, type AsyncStatus } from '../../../shared/constants'

export interface CountriesState {
  items: CountryModel[]
  locale: (typeof AID_FORM_LANGUAGE)[keyof typeof AID_FORM_LANGUAGE]
  status: AsyncStatus
  error: string | null
  lastFetchedAt: string | null
}

const initialState: CountriesState = {
  items: [],
  locale: AID_FORM_LANGUAGE.en,
  status: ASYNC_STATUS.idle,
  error: null,
  lastFetchedAt: null,
}

export const fetchCountriesAsync = createAsyncThunk<
  CountryModel[],
  void,
  { rejectValue: string; state: { countries: CountriesState } }
>('countries/fetchCountries', async (_arg, { getState, rejectWithValue }) => {
  const currentState = getState().countries
  if (currentState.items.length > 0) {
    return currentState.items
  }

  try {
    const controller = new CountriesController()
    return await controller.fetchCountries()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error ?? 'Failed to load countries.')
    return rejectWithValue(message)
  }
})

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    clearCountries(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
      state.lastFetchedAt = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountriesAsync.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCountriesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.lastFetchedAt = new Date().toISOString()
      })
      .addCase(fetchCountriesAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Failed to load countries.'
      })
  },
})

export const { clearCountries } = countriesSlice.actions
export default countriesSlice.reducer
