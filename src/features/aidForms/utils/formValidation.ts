import type { AidFormField, HelpField } from '../types/aidFormTypes'
import type { TFunction } from 'i18next'
import { AID_FORM_FIELD } from '../types/aidFormTypes'
import { EMAIL_PATTERN, PHONE_PATTERN, NUMBER_PATTERN } from '../../../shared/constants'

export const isEmptyValue = (value: unknown) => String(value ?? '').trim() === ''

export const getFieldValidationError = (
  field: AidFormField,
  value: unknown,
  t: TFunction,
): string | null => {
  const trimmed = String(value ?? '').trim()

  if (!trimmed) {
    // Use a friendly label for country-related fields.
    if (field === AID_FORM_FIELD.countryCode) {
      return t('fieldRequired', { field: t('country') })
    }
    return t('fieldRequired', { field: t(field) })
  }

  if (field === AID_FORM_FIELD.nationalId && !NUMBER_PATTERN.test(trimmed)) {
    return t('invalidNationalId')
  }

  if (field === AID_FORM_FIELD.phone) {
    // Phone number is validated by pattern only. Dial code (country phone) is optional
    // because the selected `country` may be different from the phone's dial code.
    if (!PHONE_PATTERN.test(trimmed)) {
      return t('invalidPhone')
    }
  }

  if (field === AID_FORM_FIELD.email && !EMAIL_PATTERN.test(trimmed)) {
    return t('invalidEmail')
  }

  return null
}

export const getHelpFieldValidationError = (field: HelpField, value: unknown, t: TFunction): string | null => {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) {
    return t('fieldRequired', { field: t(field) })
  }
  return null
}

// Batch validator returning first error and map of errors for a set of fields
import type { AidFormValues } from '../types/aidFormTypes'

export function validateFields(values: AidFormValues, fields: ReadonlyArray<keyof AidFormValues>, t: TFunction) {
  const errors: Record<string, string> = {}
  let firstField: keyof AidFormValues | null = null

  for (const field of fields) {
    const value = values[field as keyof AidFormValues]
    const err = getFieldValidationError(field as any, value, t)
    if (err) {
      errors[field as string] = err
      if (!firstField) firstField = field
    }
  }

  return { valid: Object.keys(errors).length === 0, errors, firstField }
}
