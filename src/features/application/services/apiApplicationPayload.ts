// Application service implementations.
// Implements domain services like AI suggestion generation for the application feature.

export interface APIApplicationPayload {
  name: string
  nationalId: string
  dateOfBirth: string
  gender: string
  address: string
  city: string
  state: string
  countryCode: string
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
