// Application domain models and types.
// Defines the application form shape and state contracts used across the feature.

import type { ApplicationFormValues } from './applicationTypes'

type ApplicationModelPayload = ApplicationFormValues & {
  id?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class ApplicationModel {
  id?: string
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
  createdAt?: Date
  updatedAt?: Date

  constructor({
    id,
    name,
    nationalId,
    dateOfBirth,
    gender,
    address,
    city,
    state,
    countryCode,
    dialCode,
    phone,
    email,
    maritalStatus,
    dependents,
    employmentStatus,
    monthlyIncome,
    housingStatus,
    financialSituation,
    employmentCircumstances,
    applicationReason,
    createdAt,
    updatedAt,
  }: ApplicationModelPayload) {
    this.id = id
    this.name = name
    this.nationalId = nationalId
    this.dateOfBirth = dateOfBirth
    this.gender = gender
    this.address = address
    this.city = city
    this.state = state
    this.countryCode = countryCode
    this.dialCode = dialCode
    this.phone = phone
    this.email = email
    this.maritalStatus = maritalStatus
    this.dependents = dependents
    this.employmentStatus = employmentStatus
    this.monthlyIncome = monthlyIncome
    this.housingStatus = housingStatus
    this.financialSituation = financialSituation
    this.employmentCircumstances = employmentCircumstances
    this.applicationReason = applicationReason
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      nationalId: this.nationalId,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      address: this.address,
      city: this.city,
      state: this.state,
      countryCode: this.countryCode,
      dialCode: this.dialCode,
      phone: this.phone,
      email: this.email,
      maritalStatus: this.maritalStatus,
      dependents: this.dependents,
      employmentStatus: this.employmentStatus,
      monthlyIncome: this.monthlyIncome,
      housingStatus: this.housingStatus,
      financialSituation: this.financialSituation,
      employmentCircumstances: this.employmentCircumstances,
      applicationReason: this.applicationReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromJSON(json: unknown): ApplicationModel {
    const data = json as Record<string, unknown>

    return new ApplicationModel({
      id: data.id as string | undefined,
      name: data.name as string,
      nationalId: data.nationalId as string,
      dateOfBirth: data.dateOfBirth as string,
      gender: data.gender as string,
      address: data.address as string,
      city: data.city as string,
      state: data.state as string,
      countryCode: data.countryCode as string,
      dialCode: data.dialCode as string,
      phone: data.phone as string,
      email: data.email as string,
      maritalStatus: data.maritalStatus as string,
      dependents: typeof data.dependents === 'number' ? data.dependents : Number(data.dependents),
      employmentStatus: data.employmentStatus as string,
      monthlyIncome: typeof data.monthlyIncome === 'number' ? data.monthlyIncome : Number(data.monthlyIncome),
      housingStatus: data.housingStatus as string,
      financialSituation: data.financialSituation as string,
      employmentCircumstances: data.employmentCircumstances as string,
      applicationReason: data.applicationReason as string,
      createdAt: data.createdAt ? new Date(data.createdAt as string) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt as string) : undefined,
    })
  }
}
