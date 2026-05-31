import type { ComponentType } from 'react'
import {
  AID_FORM_FIELD,
  AID_FORM_STEP,
  AID_FORM_STEP_TITLE,
  type AidFormField,
  type AidFormStep,
  type AidFormStepTitle,
} from './types/aidFormTypes'
import { PersonalDetailsStep } from './components/Step1'
import { FamilyFinancialStep } from './components/Step2'
import { StatementStep } from './components/Step3'

type StepComponent = ComponentType<any> // eslint-disable-line @typescript-eslint/no-explicit-any

type StepDefinition = {
  title: AidFormStepTitle
  fields: readonly AidFormField[]
  Component: StepComponent
}

export const stepDefinitions: Record<AidFormStep, StepDefinition> = {
  [AID_FORM_STEP.step1]: {
    title: AID_FORM_STEP_TITLE.personalInformation,
    fields: [
      AID_FORM_FIELD.name,
      AID_FORM_FIELD.nationalId,
      AID_FORM_FIELD.dateOfBirth,
      AID_FORM_FIELD.gender,
      AID_FORM_FIELD.phone,
      AID_FORM_FIELD.countryCode,
      AID_FORM_FIELD.dialCode,
      AID_FORM_FIELD.address,
      AID_FORM_FIELD.state,
      AID_FORM_FIELD.city,
      AID_FORM_FIELD.email,
    ],
    Component: PersonalDetailsStep,
  },
  [AID_FORM_STEP.step2]: {
    title: AID_FORM_STEP_TITLE.familyFinancialInfo,
    fields: [
      AID_FORM_FIELD.maritalStatus,
      AID_FORM_FIELD.dependents,
      AID_FORM_FIELD.employmentStatus,
      AID_FORM_FIELD.monthlyIncome,
      AID_FORM_FIELD.housingStatus,
    ],
    Component: FamilyFinancialStep,
  },
  [AID_FORM_STEP.step3]: {
    title: AID_FORM_STEP_TITLE.situationDescriptions,
    fields: [
      AID_FORM_FIELD.financialSituation,
      AID_FORM_FIELD.employmentCircumstances,
      AID_FORM_FIELD.applicationReason,
    ],
    Component: StatementStep,
  },
}
