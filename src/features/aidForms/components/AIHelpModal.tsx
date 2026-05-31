// Modal component for displaying and accepting AI-generated help suggestions.
import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import type { FC } from 'react'

import styles from '../styles/AIHelpModal.module.css'

interface AIHelpModalProps {
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

export const AIHelpModal: FC<AIHelpModalProps> = ({
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
    if (visible) {
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      document.addEventListener('keydown', handleKey)
      // focus textarea when modal opens
      setTimeout(() => textareaRef.current?.focus(), 0)
      return () => document.removeEventListener('keydown', handleKey)
    }
    return undefined
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
      onClick={(e) => {
        // close when clicking on overlay background
        if (e.target === e.currentTarget) onClose()
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
            onChange={(event) => onChange(event.target.value)}
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

