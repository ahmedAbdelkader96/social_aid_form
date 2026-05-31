/**
 * aidForm domain types describing form state, step flow, and language settings.
 * Centralizes type definitions so components, stores, and services stay aligned.
 */
export const AID_FORM_LANGUAGE = {
  en: 'en',
  ar: 'ar',
} as const

export type AidFormLanguage = (typeof AID_FORM_LANGUAGE)[keyof typeof AID_FORM_LANGUAGE]

export const AID_FORM_HELP_FIELD = {
  financialSituation: 'financialSituation',
  employmentCircumstances: 'employmentCircumstances',
  applicationReason: 'applicationReason',
} as const

export type HelpField = (typeof AID_FORM_HELP_FIELD)[keyof typeof AID_FORM_HELP_FIELD]

export const AID_FORM_FIELD = {
  name: 'name',
  nationalId: 'nationalId',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  address: 'address',
  city: 'city',
  state: 'state',
  countryCode: 'countryCode',
  dialCode: 'dialCode',
  phone: 'phone',
  email: 'email',
  maritalStatus: 'maritalStatus',
  dependents: 'dependents',
  employmentStatus: 'employmentStatus',
  monthlyIncome: 'monthlyIncome',
  housingStatus: 'housingStatus',
  financialSituation: 'financialSituation',
  employmentCircumstances: 'employmentCircumstances',
  applicationReason: 'applicationReason',
} as const

export type AidFormField = (typeof AID_FORM_FIELD)[keyof typeof AID_FORM_FIELD]

export const AID_FORM_GENDER = {
  female: 'female',
  male: 'male',
  other: 'other',
} as const

export type AidFormGender = (typeof AID_FORM_GENDER)[keyof typeof AID_FORM_GENDER]

export const AID_FORM_MARITAL_STATUS = {
  single: 'single',
  married: 'married',
  divorced: 'divorced',
  widowed: 'widowed',
} as const

export type AidFormMaritalStatus = (typeof AID_FORM_MARITAL_STATUS)[keyof typeof AID_FORM_MARITAL_STATUS]

export const AID_FORM_EMPLOYMENT_STATUS = {
  employed: 'employed',
  unemployed: 'unemployed',
  selfEmployed: 'self-employed',
  student: 'student',
} as const

export type AidFormEmploymentStatus = (typeof AID_FORM_EMPLOYMENT_STATUS)[keyof typeof AID_FORM_EMPLOYMENT_STATUS]

export const AID_FORM_HOUSING_STATUS = {
  renting: 'renting',
  owning: 'owning',
  livingWithFamily: 'living-with-family',
  temporaryShelter: 'temporary',
} as const

export type AidFormHousingStatus = (typeof AID_FORM_HOUSING_STATUS)[keyof typeof AID_FORM_HOUSING_STATUS]

export interface AidFormValues {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  countryCode: string
  dialCode: string
  phone: string
  email: string
  maritalStatus: string
  dependents: number
  employmentStatus: string
  monthlyIncome: number
  housingStatus: string
  financialSituation: string
  employmentCircumstances: string
  applicationReason: string
}

export const AID_FORM_STEP = {
  step1: 1,
  step2: 2,
  step3: 3,
} as const

export type AidFormStep = (typeof AID_FORM_STEP)[keyof typeof AID_FORM_STEP]

export const AID_FORM_SUBMIT_STATUS = {
  idle: 'idle',
  submitting: 'submitting',
  success: 'success',
  failed: 'failed',
} as const

export type AidFormSubmitStatus = (typeof AID_FORM_SUBMIT_STATUS)[keyof typeof AID_FORM_SUBMIT_STATUS]

export interface AidFormState {
  currentStep: AidFormStep
  language: AidFormLanguage
  form: AidFormValues
  submitStatus: AidFormSubmitStatus
  submitError: string | null
}

export type AidFormPayload = AidFormValues

export interface AidFormResponse {
  success: boolean
  id?: string
}

export interface AidFormSubmitResult {
  success: boolean
  submittedAt: string
  applicationId?: string
  response: AidFormResponse
}

export const defaultAidForm: AidFormValues = {
  name: '',
  nationalId: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  city: '',
  state: '',
  countryCode: '',
  dialCode: '+1',
  phone: '',
  email: '',
  maritalStatus: '',
  dependents: 0,
  employmentStatus: '',
  monthlyIncome: 0,
  housingStatus: '',
  financialSituation: '',
  employmentCircumstances: '',
  applicationReason: '',
}

