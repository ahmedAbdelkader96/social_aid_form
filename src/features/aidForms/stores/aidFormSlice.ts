// aidForm feature Redux slice implementation defining state, reducers, and actions.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AidFormState, AidFormValues, AidFormLanguage } from '../types/aidFormTypes'
import { AID_FORM_STEP, AID_FORM_SUBMIT_STATUS, defaultAidForm } from '../types/aidFormTypes'
import AidFormController from '../controller/AidFormController'

const aidFormController = new AidFormController()

const initialState: AidFormState = {
  currentStep: AID_FORM_STEP.step1,
  language: 'en',
  form: defaultAidForm,
  submitStatus: AID_FORM_SUBMIT_STATUS.idle,
  submitError: null,
}

export const submitAidFormAsync = createAsyncThunk<
  void,
  AidFormValues,
  { rejectValue: string }
>('aidForm/submit', async (values, { rejectWithValue }) => {
  try {
    const success = await aidFormController.submitAidForm(values)
    if (!success) {
      return rejectWithValue('aidForm submission failed.')
    }
    return
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('Unexpected submission error.')
  }
})

const aidFormSlice = createSlice({
  name: 'aidForm',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<AidFormState['currentStep']>) {
      state.currentStep = action.payload
    },
    setLanguage(state, action: PayloadAction<AidFormLanguage>) {
      state.language = action.payload
    },
    updateForm(state, action: PayloadAction<Partial<AidFormValues>>) {
      state.form = { ...state.form, ...action.payload }
    },
    resetForm(state) {
      state.form = defaultAidForm
      state.currentStep = AID_FORM_STEP.step1
      state.submitStatus = AID_FORM_SUBMIT_STATUS.idle
      state.submitError = null
    },
    setSubmitStatus(state, action: PayloadAction<AidFormState['submitStatus']>) {
      state.submitStatus = action.payload
    },
    setSubmitError(state, action: PayloadAction<string | null>) {
      state.submitError = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAidFormAsync.pending, (state) => {
        state.submitStatus = AID_FORM_SUBMIT_STATUS.submitting
        state.submitError = null
      })
      .addCase(submitAidFormAsync.fulfilled, (state) => {
        state.submitStatus = AID_FORM_SUBMIT_STATUS.success
      })
      .addCase(submitAidFormAsync.rejected, (state, action) => {
        state.submitStatus = AID_FORM_SUBMIT_STATUS.failed
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
} = aidFormSlice.actions

export default aidFormSlice.reducer


