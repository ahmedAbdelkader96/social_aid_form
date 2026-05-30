// Application feature Redux slice implementation defining state, reducers, and actions.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ApplicationState, ApplicationFormValues, ApplicationLanguage } from '../models/applicationTypes'
import { defaultForm } from '../models/applicationTypes'
import ApplicationController from '../controller/ApplicationController'

const applicationController = new ApplicationController()

const initialState: ApplicationState = {
  currentStep: 1,
  language: 'en',
  form: defaultForm,
  submitStatus: 'idle',
  submitError: null,
}

export const submitApplicationAsync = createAsyncThunk<
  void,
  ApplicationFormValues,
  { rejectValue: string }
>('application/submit', async (values, { rejectWithValue }) => {
  try {
    const result = await applicationController.submitApplication(values)
    if (!result.success) {
      return rejectWithValue('Application submission failed.')
    }
    return
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Unexpected submission error.')
  }
})

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<ApplicationState['currentStep']>) {
      state.currentStep = action.payload
    },
    setLanguage(state, action: PayloadAction<ApplicationLanguage>) {
      state.language = action.payload
    },
    updateForm(state, action: PayloadAction<Partial<ApplicationFormValues>>) {
      state.form = { ...state.form, ...action.payload }
    },
    resetForm(state) {
      state.form = defaultForm
      state.currentStep = 1
      state.submitStatus = 'idle'
      state.submitError = null
    },
    setSubmitStatus(state, action: PayloadAction<ApplicationState['submitStatus']>) {
      state.submitStatus = action.payload
    },
    setSubmitError(state, action: PayloadAction<string | null>) {
      state.submitError = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplicationAsync.pending, (state) => {
        state.submitStatus = 'submitting'
        state.submitError = null
      })
      .addCase(submitApplicationAsync.fulfilled, (state) => {
        state.submitStatus = 'success'
      })
      .addCase(submitApplicationAsync.rejected, (state, action) => {
        state.submitStatus = 'failed'
        state.submitError = action.payload ?? action.error.message ?? 'Submission failed.'
      })
  },
})

export const {
  setStep,
  setLanguage,
  updateForm,
  resetForm,
  setSubmitStatus,
  setSubmitError,
} = applicationSlice.actions

export default applicationSlice.reducer

