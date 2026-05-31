// Reusable animated field wrapper for form labels and inputs.
// This shared component centralizes motion behavior for labels across modules.
import { motion } from 'framer-motion'
import { Children } from 'react'
import type { FC, PropsWithChildren, ReactNode } from 'react'

interface AnimatedFieldLabelProps {
  delayIndex: number
  className?: string
  delayFactor?: number
}

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: ({ delayIndex, delayFactor }: { delayIndex: number; delayFactor: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
      delay: delayIndex * delayFactor,
    },
  }),
}

export const AnimatedFieldLabel: FC<PropsWithChildren<AnimatedFieldLabelProps>> = ({
  delayIndex,
  delayFactor = 0.06,
  className,
  children,
}) => {
  const childArray = Children.toArray(children)
  const [firstChild, ...rest] = childArray

  const labelText = typeof firstChild === 'string' || typeof firstChild === 'number'
    ? (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        {firstChild}
        <span style={{ color: '#dc2626', fontWeight: 700 }}>*</span>
      </span>
    )
    : firstChild as ReactNode

  return (
    <motion.label
      className={className}
      variants={fieldVariants}
      custom={{ delayIndex, delayFactor }}
      initial="hidden"
      animate="visible"
    >
      {labelText}
      {rest}
    </motion.label>
  )
}
