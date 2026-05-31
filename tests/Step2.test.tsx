import { render, screen } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Step2 } from '../src/features/aidForms/components/Step2'
import type { AidFormValues } from '../src/features/aidForms/types/aidFormTypes'
import type { FieldErrors } from 'react-hook-form'

function Wrapper(props: { errors?: FieldErrors<AidFormValues> }) {
  const { register } = useForm<AidFormValues>()
  return <Step2 register={register} errors={props.errors ?? {}} />
}

test('renders Step2 fields and shows required error when provided', async () => {
  render(<Wrapper />)

  // marital status select
  expect(screen.getByLabelText(/maritalStatus/i) || screen.getByText(/maritalStatus/)).toBeTruthy()

  // dependents input (number) accessed by label
  const dependents = screen.getByLabelText(/dependents/i)
  expect(dependents).toBeInTheDocument()
})

test('shows required error when provided', () => {
  render(<Wrapper errors={{ maritalStatus: { type: 'required' } }} />)
  expect(screen.getByText(/fieldRequired/i)).toBeInTheDocument()
})



