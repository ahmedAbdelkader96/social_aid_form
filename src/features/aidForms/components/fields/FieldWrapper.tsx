import type { ReactNode } from 'react'
import { AnimatedFieldLabel } from '../../../../shared/ui/AnimatedFieldLabel'

interface FieldWrapperProps {
  label: string
  delayIndex: number
  children: ReactNode
  className?: string
}

export function FieldWrapper({ label, delayIndex, children, className }: FieldWrapperProps) {
  return (
    <AnimatedFieldLabel className={className} delayIndex={delayIndex}>
      {label}
      {children}
    </AnimatedFieldLabel>
  )
}
