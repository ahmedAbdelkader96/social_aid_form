// Shared UI components.
// Provides reusable presentational components used by multiple features.

import { motion } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: 'easeOut',
      delay: custom * 0.05,
    },
  }),
}

interface AnimatedFieldLabelProps {
  delayIndex: number
  className?: string
}

export const AnimatedFieldLabel: FC<PropsWithChildren<AnimatedFieldLabelProps>> = ({ delayIndex, children, className }) => (
  <motion.label
    className={className}
    variants={fieldVariants}
    custom={delayIndex}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.label>
)
