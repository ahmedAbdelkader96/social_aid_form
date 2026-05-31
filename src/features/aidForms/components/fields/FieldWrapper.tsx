import type { ReactNode } from 'react'
import { AnimatedFieldLabel } from '../../../../shared/ui/AnimatedFieldLabel'

interface FieldWrapperProps {
  label: string
  delayIndex: number
  children: ReactNode
  error?: string
  className?: string
}

export function FieldWrapper({ label, delayIndex, children }: FieldWrapperProps) {
  // Inline error spans removed — errors are shown via toasts only.
  return (
    <AnimatedFieldLabel className={undefined} delayIndex={delayIndex}>
      {label}
      {children}
    </AnimatedFieldLabel>
  )
}
