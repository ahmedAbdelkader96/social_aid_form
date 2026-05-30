// Redux slice for country state.
// Contains reducers and async actions for country loading and storage.

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { countriesController } from '../../../app/di'
import CountryModel from '../models/CountryModel'

export interface CountriesState {
  items: CountryModel[]
  locale: 'en' | 'ar'
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  lastFetchedAt: string | null
}

const initialState: CountriesState = {
  items: [],
  locale: 'en',
  status: 'idle',
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
    return await countriesController.fetchCountries()
  } catch (error: any) {
    return rejectWithValue(error?.message ?? 'Failed to load countries.')
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
        // Debug: log SR in Redux store
        const srInStore = action.payload.find((c: any) => c.code === 'SR')
        if (srInStore) {
          console.log('countriesSlice: SR stored in Redux:', {
            code: srInStore.code,
            nameEn: srInStore.nameEn,
            nameAr: srInStore.nameAr,
            dialCode: srInStore.dialCode,
            flagUrl: srInStore.flagUrl,
          })
        }
      })
      .addCase(fetchCountriesAsync.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Failed to load countries.'
      })
  },
})

export const { clearCountries } = countriesSlice.actions
export default countriesSlice.reducer
