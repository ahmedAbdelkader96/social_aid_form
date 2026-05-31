import type { TFunction } from 'i18next'
import type { Option } from '../../../shared/ui/SelectMenu'
import { AID_FORM_EMPLOYMENT_STATUS, AID_FORM_GENDER, AID_FORM_HOUSING_STATUS, AID_FORM_MARITAL_STATUS } from '../types/aidFormTypes'

export const getGenderOptions = (t: TFunction): Option[] => [
  { value: AID_FORM_GENDER.female, label: t('female') },
  { value: AID_FORM_GENDER.male, label: t('male') },
  { value: AID_FORM_GENDER.other, label: t('other') },
]

export const getEmploymentStatusOptions = (t: TFunction): Option[] => [
  { value: AID_FORM_EMPLOYMENT_STATUS.employed, label: t('employed') },
  { value: AID_FORM_EMPLOYMENT_STATUS.unemployed, label: t('unemployed') },
  { value: AID_FORM_EMPLOYMENT_STATUS.selfEmployed, label: t('selfEmployed') },
  { value: AID_FORM_EMPLOYMENT_STATUS.student, label: t('student') },
]

export const getHousingStatusOptions = (t: TFunction): Option[] => [
  { value: AID_FORM_HOUSING_STATUS.renting, label: t('renting') },
  { value: AID_FORM_HOUSING_STATUS.owning, label: t('owning') },
  { value: AID_FORM_HOUSING_STATUS.livingWithFamily, label: t('livingWithFamily') },
  { value: AID_FORM_HOUSING_STATUS.temporaryShelter, label: t('temporaryShelter') },
]

export const getMaritalStatusOptions = (t: TFunction): Option[] => [
  { value: AID_FORM_MARITAL_STATUS.single, label: t('single') },
  { value: AID_FORM_MARITAL_STATUS.married, label: t('married') },
  { value: AID_FORM_MARITAL_STATUS.divorced, label: t('divorced') },
  { value: AID_FORM_MARITAL_STATUS.widowed, label: t('widowed') },
]
