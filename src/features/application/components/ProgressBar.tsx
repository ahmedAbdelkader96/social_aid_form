// Visual progress bar component for showing application step completion.
import { useMemo } from 'react'
import type { FC } from 'react'
import styles from '../styles/ApplicationForm.module.css'

interface ProgressBarProps {
  currentStep: number
}

export const ProgressBar: FC<ProgressBarProps> = ({ currentStep }) => {
  const segments = useMemo(() => [1, 2, 3], [])

  return (
    <div className={styles.progressWrapper} aria-label="Progress">
      <div className={styles.progressSegments}>
        {segments.map((step) => (
          <div
            key={step}
            className={`${styles.progressSegment} ${currentStep >= step ? styles.segmentActive : ''}`}
          />
        ))}
      </div>
    </div>
  )
}

