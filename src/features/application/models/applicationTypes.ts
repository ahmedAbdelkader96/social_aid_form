export type ApplicationLanguage = 'en' | 'ar'

export interface ApplicationFormValues {
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

export type ApplicationStep = 1 | 2 | 3

export interface ApplicationState {
  currentStep: ApplicationStep
  language: ApplicationLanguage
  form: ApplicationFormValues
  submitStatus: 'idle' | 'submitting' | 'success' | 'failed'
  submitError: string | null
}

export const defaultForm: ApplicationFormValues = {
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
