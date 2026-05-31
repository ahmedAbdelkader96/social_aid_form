import { useEffect } from 'react'
import type { i18n } from 'i18next'
import type { AidFormLanguage } from '../types/aidFormTypes'
import { AID_FORM_LANGUAGE } from '../types/aidFormTypes'

export function useLanguageSync(language: AidFormLanguage, i18nInstance: i18n) {
  useEffect(() => {
    i18nInstance.changeLanguage(language)
    document.documentElement.dir = language === AID_FORM_LANGUAGE.ar ? 'rtl' : 'ltr'
  }, [i18nInstance, language])
}
