import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

// Mock hooks and stores
vi.mock('../src/app/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: () => ({
    items: [
      { code: 'XX', nameEn: 'CountryX', nameAr: 'دولةX', dialCode: '+99', flagUrl: '' },
    ],
    status: 'idle',
  }),
}))
vi.mock('../src/features/countries/stores', () => ({ fetchCountriesAsync: vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k, i18n: { language: 'en' } }) }))

import { useForm } from 'react-hook-form'
import { Step1 } from '../src/features/aidForms/components/Step1'
import type { AidFormValues } from '../src/features/aidForms/types/aidFormTypes'

function Wrapper() {
  const { register, setValue, getValues } = useForm<AidFormValues>()
  return <Step1 register={register} setValue={setValue} getValues={getValues} errors={{}} />
}

test('typing opens suggestions and selecting country updates input', async () => {
  render(<Wrapper />)

  const countryInput = screen.getByPlaceholderText('countryLookupPlaceholder')
  fireEvent.focus(countryInput)
  fireEvent.change(countryInput, { target: { value: 'CountryX' } })

  // Expect the suggestion item to appear and select it via mouse down
  const optionText = await screen.findByText('CountryX')
  const option = optionText.closest('li')
  expect(option).not.toBeNull()
  fireEvent.mouseDown(option!)

  await waitFor(() => {
    expect((countryInput as HTMLInputElement).value).toBe('CountryX')
  })
})



