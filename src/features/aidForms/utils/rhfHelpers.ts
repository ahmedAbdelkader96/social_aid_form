import type { UseFormClearErrors, UseFormRegisterReturn, UseFormTrigger } from 'react-hook-form'
import type { AidFormValues } from '../types/aidFormTypes'

type RegisterOnChangeEvent = Parameters<NonNullable<UseFormRegisterReturn['onChange']>>[0]
type RegisterOnBlurEvent = Parameters<NonNullable<UseFormRegisterReturn['onBlur']>>[0]

export function enhanceRegisterEvent(
  reg: UseFormRegisterReturn,
  field: keyof AidFormValues,
  trigger?: UseFormTrigger<AidFormValues>,
  clearErrors?: UseFormClearErrors<AidFormValues>,
  dismissToast?: () => void,
) {
  return {
    ...reg,
    onChange: (event: RegisterOnChangeEvent) => {
      if (typeof reg.onChange === 'function') reg.onChange(event)
      if (clearErrors) clearErrors(field)
      if (dismissToast) dismissToast()
    },
    onBlur: async (event: RegisterOnBlurEvent) => {
      if (typeof reg.onBlur === 'function') await reg.onBlur(event)
      if (trigger) await trigger(field)
    },
  }
}
