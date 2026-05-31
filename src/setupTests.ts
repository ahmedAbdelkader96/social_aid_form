import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Provide a minimal react-i18next mock for tests so `t` returns the key
vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en', changeLanguage: () => Promise.resolve() } }),
}))

// Mock framer-motion to render elements synchronously in tests
import React from 'react'
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: React.HTMLAttributes<HTMLDivElement>) => React.createElement('div', props),
    label: (props: React.LabelHTMLAttributes<HTMLLabelElement>) => React.createElement('label', props),
  },
  AnimatePresence: (props: React.PropsWithChildren<Record<string, unknown>>) => React.createElement(React.Fragment, props),
}))
