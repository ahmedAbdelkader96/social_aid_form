import { useEffect, useRef, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { FC } from 'react'

import styles from '../styles/SuggestionDialog.module.css'

interface SuggestionDialogProps {
  visible: boolean
  title: string
  value: string
  loading: boolean
  error?: string
  onClose: () => void
  onAccept: () => void
  onDiscard: () => void
  onChange: (value: string) => void
}

export const SuggestionDialog: FC<SuggestionDialogProps> = ({
  visible,
  title,
  value,
  loading,
  error,
  onClose,
  onAccept,
  onDiscard,
  onChange,
}) => {
  const { t } = useTranslation()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!visible) return undefined

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKey)
    textareaRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKey)
  }, [visible, onClose])

  if (!visible) {
    return null
  }

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button className={styles.modalClose} type="button" onClick={onClose} aria-label={t('close')}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          {error ? <p className={styles.errorMessage}>{error}</p> : null}
          <textarea
            ref={textareaRef}
            className={styles.modalTextarea}
            value={value}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
            rows={10}
            aria-label={t('suggestions')}
            disabled={loading}
          />
        </div>
        <div className={styles.modalActions}>
          <button className={styles.discardButton} type="button" onClick={onDiscard} disabled={loading}>
            {t('discard')}
          </button>
          <button className={styles.acceptButton} type="button" onClick={onAccept} disabled={loading || !value.trim()}>
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
