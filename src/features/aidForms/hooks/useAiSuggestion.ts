import { useCallback, useState } from 'react'
import type { HelpField, AidFormValues } from '../types/aidFormTypes'
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import type { TFunction } from 'i18next'
import { generateAISuggestion } from '../../../shared/api/aiClient'
import { parseAiSuggestion } from '../utils/parseAiSuggestion'

interface UseAiSuggestionParams {
  getValues: UseFormGetValues<AidFormValues>
  setValue: UseFormSetValue<AidFormValues>
  t: TFunction
}

export function useAiSuggestion({ getValues, setValue, t }: UseAiSuggestionParams) {
  const [helpField, setHelpField] = useState<HelpField | null>(null)
  const [helpText, setHelpText] = useState('')
  const [helpLoading, setHelpLoading] = useState(false)
  const [helpError, setHelpError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const resetSuggestionState = useCallback(() => {
    setHelpField(null)
    setHelpText('')
    setHelpError(null)
    setHelpLoading(false)
    setIsModalOpen(false)
  }, [])

  const openSuggestion = useCallback(
    async (field: HelpField) => {
      setHelpField(field)
      setHelpText('')
      setHelpError(null)
      setHelpLoading(true)
      setIsModalOpen(true)

      try {
        const values = getValues()
        const suggestion = await generateAISuggestion(field, values as unknown)
        setHelpText(suggestion)
      } catch (error) {
        setHelpError(error instanceof Error ? error.message : t('suggestionError'))
      } finally {
        setHelpLoading(false)
      }
    },
    [getValues, t],
  )

  const handleAcceptSuggestion = useCallback(() => {
    if (!helpField) return

    const appliedText = parseAiSuggestion(helpText, helpField)
    setValue(helpField, appliedText, { shouldDirty: true, shouldTouch: true })
    setIsModalOpen(false)
  }, [helpField, helpText, setValue])

  const handleDiscardSuggestion = useCallback(() => {
    resetSuggestionState()
  }, [resetSuggestionState])

  return {
    helpField,
    helpText,
    setHelpText,
    helpLoading,
    helpError,
    isModalOpen,
    openSuggestion,
    handleAcceptSuggestion,
    handleDiscardSuggestion,
    resetSuggestionState,
  }
}
