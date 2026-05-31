import type { AidFormField, HelpField, AidFormValues } from '../types/aidFormTypes'
import type { FieldErrors } from 'react-hook-form'
import type { TFunction } from 'i18next'
import { AID_FORM_FIELD } from '../types/aidFormTypes'
import { EMAIL_PATTERN, PHONE_PATTERN, NUMBER_PATTERN } from '../../../shared/constants'

export const isEmptyValue = (value: unknown): boolean => {
  // Handle null and undefined
  if (value === null || value === undefined) return true
  
  // Handle numbers - only 0 and NaN are considered empty for non-numeric fields
  if (typeof value === 'number') {
    return isNaN(value)
  }
  
  // Handle strings and everything else
  return String(value).trim() === ''
}

export const getFieldValidationError = (
  field: AidFormField,
  value: unknown,
  t: TFunction,
): string | null => {
  // First check: is the field empty?
  if (isEmptyValue(value)) {
    // Use a friendly label for country-related fields
    if (field === AID_FORM_FIELD.countryCode) {
      return t('fieldRequired', { field: t('country') })
    }
    return t('fieldRequired', { field: t(field) })
  }

  // Second check: validate specific patterns
  const trimmed = String(value).trim()

  if (field === AID_FORM_FIELD.nationalId && !NUMBER_PATTERN.test(trimmed)) {
    return t('invalidNationalId')
  }

  if (field === AID_FORM_FIELD.phone && !PHONE_PATTERN.test(trimmed)) {
    return t('invalidPhone')
  }

  if (field === AID_FORM_FIELD.email && !EMAIL_PATTERN.test(trimmed)) {
    return t('invalidEmail')
  }

  return null
}

export const getHelpFieldValidationError = (field: HelpField, value: unknown, t: TFunction): string | null => {
  if (isEmptyValue(value)) {
    return t('fieldRequired', { field: t(field) })
  }
  return null
}

// Batch validator returning first error and map of errors for a set of fields

export function validateFields(values: AidFormValues, fields: ReadonlyArray<AidFormField>, t: TFunction) {
  const errors: Record<string, string> = {}
  let firstField: AidFormField | null = null

  console.debug('validateFields input', {
    nameValue: values.name,
    allValues: values,
    fieldCount: fields.length,
  })

  for (const field of fields) {
    const value = values[field]
    const err = getFieldValidationError(field, value, t)
    if (err) {
      errors[field] = err
      if (!firstField) firstField = field
    }
  }

  console.debug('validateFields output', {
    firstField,
    nameError: errors.name,
    allErrors: errors,
  })

  return { valid: Object.keys(errors).length === 0, errors, firstField }
}

export function getFirstErrorMessage(
  values: AidFormValues,
  fields: ReadonlyArray<AidFormField>,
  errors: FieldErrors<AidFormValues> = {},
  t: TFunction,
) {
  console.debug('getFirstErrorMessage input', {
    nameValue: values.name,
    nameRhfError: errors.name,
  })

  // Validate all fields based on actual values to find the first truly invalid field
  // This ensures we show the correct error even if RHF errors object has stale data
  const { firstField, errors: validationErrors } = validateFields(values, fields, t)
  if (firstField) {
    console.debug('getFirstErrorMessage result', {
      message: validationErrors[firstField],
      fromValidateFields: true,
    })
    return validationErrors[firstField]
  }

  // If no validation errors based on values, fall back to checking RHF errors
  // (for custom validation messages like invalidNationalId, invalidEmail, etc.)
  for (const field of fields) {
    const error = errors[field]
    if (error) {
      if (typeof error.message === 'string' && error.message.trim() !== '') {
        console.debug('getFirstErrorMessage result', {
          message: error.message,
          fromRhfError: true,
        })
        return error.message
      }
    }
  }

  return t('pleaseFixErrors')
}
