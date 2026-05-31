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
		div: (props: any) => React.createElement('div', props),
		label: (props: any) => React.createElement('label', props),
	},
	AnimatePresence: (props: any) => React.createElement(React.Fragment, props),
}))
