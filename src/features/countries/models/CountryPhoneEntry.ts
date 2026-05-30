// Country domain models.
// Defines country data shapes and type contracts for the feature.

export interface CountryPhoneEntry {
  code: string
  name: string
  dialCode: string
  flagUrl?: string
}
