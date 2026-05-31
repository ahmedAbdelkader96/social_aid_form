import type CountryModel from '../../countries/models/CountryModel'
import { AID_FORM_FIELD, AID_FORM_GENDER, AID_FORM_HOUSING_STATUS, AID_FORM_MARITAL_STATUS, AID_FORM_EMPLOYMENT_STATUS, type AidFormValues } from '../types/aidFormTypes'

export type NormalizedAidFormPayload = Omit<AidFormValues, 'dialCode'>

const canonicalFieldValues = {
  [AID_FORM_FIELD.gender]: {
    [AID_FORM_GENDER.female]: 'Female',
    [AID_FORM_GENDER.male]: 'Male',
    [AID_FORM_GENDER.other]: 'Other',
  },
  [AID_FORM_FIELD.maritalStatus]: {
    [AID_FORM_MARITAL_STATUS.single]: 'Single',
    [AID_FORM_MARITAL_STATUS.married]: 'Married',
    [AID_FORM_MARITAL_STATUS.divorced]: 'Divorced',
    [AID_FORM_MARITAL_STATUS.widowed]: 'Widowed',
  },
  [AID_FORM_FIELD.employmentStatus]: {
    [AID_FORM_EMPLOYMENT_STATUS.employed]: 'Employed',
    [AID_FORM_EMPLOYMENT_STATUS.unemployed]: 'Unemployed',
    [AID_FORM_EMPLOYMENT_STATUS.selfEmployed]: 'Self-Employed',
    [AID_FORM_EMPLOYMENT_STATUS.student]: 'Student',
  },
  [AID_FORM_FIELD.housingStatus]: {
    [AID_FORM_HOUSING_STATUS.renting]: 'Rented',
    [AID_FORM_HOUSING_STATUS.owning]: 'Owned',
    [AID_FORM_HOUSING_STATUS.livingWithFamily]: 'Living with family',
    [AID_FORM_HOUSING_STATUS.temporaryShelter]: 'Temporary shelter',
  },
} as const

const cleanNumber = (value?: string) => (value ? String(value).replace(/[^0-9]/g, '') : '')

export function normalizeAidFormPayload(values: AidFormValues, countries: CountryModel[]): NormalizedAidFormPayload {
  const payload: Partial<AidFormValues> & { dialCode?: string } = { ...values }

  if (payload.countryCode) {
    const country = countries.find((country) => country.code === payload.countryCode)
    if (country?.dialCode) {
      payload.dialCode = country.dialCode
    }
  }

  const rawPhone = String(payload.phone ?? '').trim()
  if (rawPhone) {
    if (rawPhone.startsWith('+')) {
      payload.phone = rawPhone.replace(/\s+/g, '')
    } else if (payload.dialCode) {
      const dialClean = payload.dialCode.replace(/[^0-9+]/g, '')
      payload.phone = `${dialClean}${cleanNumber(rawPhone)}`
    } else {
      payload.phone = `+${cleanNumber(rawPhone)}`
    }
  }

  for (const field of Object.keys(canonicalFieldValues) as Array<keyof typeof canonicalFieldValues>) {
    const fieldValue = payload[field]
    const map = canonicalFieldValues[field]
    if (fieldValue && map && map[fieldValue as keyof typeof map]) {
      payload[field] = map[fieldValue as keyof typeof map]
    }
  }

  delete payload.dialCode
  return payload as NormalizedAidFormPayload
}
