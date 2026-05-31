// Visual progress bar component for showing aidForm step completion.
import type { FC } from 'react'
import styles from '../styles/AidForm.module.css'

interface ProgressBarProps {
  currentStep: number
}

const progressSteps = [1, 2, 3] as const

export const ProgressBar: FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className={styles.progressWrapper} aria-label="Progress">
      <div className={styles.progressSegments}>
        {progressSteps.map((step) => (
          <div
            key={step}
            className={`${styles.progressSegment} ${currentStep >= step ? styles.segmentActive : ''}`}
          />
        ))}
      </div>
    </div>
  )
}


