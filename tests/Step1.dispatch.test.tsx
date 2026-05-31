import { render } from '@testing-library/react'
import { vi } from 'vitest'
// Mock fetchCountriesAsync to return a plain action so dispatch receives a value we can assert
vi.mock('../src/features/countries/stores', () => ({ fetchCountriesAsync: () => ({ type: 'countries/fetchCountries' }) }))

const mockDispatch = vi.fn()
vi.mock('../src/app/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => ({ items: [], status: 'idle' }),
}))

import { useForm } from 'react-hook-form'
import { Step1 } from '../src/features/aidForms/components/Step1'
import type { AidFormValues } from '../src/features/aidForms/types/aidFormTypes'

function Wrapper() {
  const { register, setValue, control } = useForm<AidFormValues>()
  return <Step1 register={register} setValue={setValue} control={control} errors={{}} />
}

test('dispatches fetchCountriesAsync on mount', () => {
  render(<Wrapper />)
  expect(mockDispatch).toHaveBeenCalled()
})



