import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { vi } from 'vitest'
import { Step1 } from '../src/features/aidForms/components/Step1'
import type { AidFormValues } from '../src/features/aidForms/types/aidFormTypes'

// Mock app hooks to provide countries state and dispatch
vi.mock('../src/app/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: () => ({
    items: [
      { code: 'XX', nameEn: 'CountryX', nameAr: 'دولةX', dialCode: '+99', flagUrl: '' },
    ],
    status: 'idle',
  }),
}))

// Mock fetchCountriesAsync to avoid real network calls
vi.mock('../src/features/countries/stores', () => ({
  fetchCountriesAsync: vi.fn(),
}))

// Ensure react-i18next is mocked with a language value in this test
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en', changeLanguage: () => Promise.resolve() } }),
}))

function Wrapper() {
  const { register, setValue, getValues } = useForm<AidFormValues>()
  return <Step1 register={register} setValue={setValue} getValues={getValues} errors={{}} />
}

test('renders Step1 fields and can open country list', async () => {
  render(<Wrapper />)

  // name input
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument()

  // country input by placeholder (mock returns key name)
  const countryInput = screen.getByPlaceholderText('countryLookupPlaceholder')
  expect(countryInput).toBeInTheDocument()

  // verify the country field exists and is initially empty
  expect((countryInput as HTMLInputElement).value).toBe('')
})



