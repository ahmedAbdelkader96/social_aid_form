import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }))

import { useForm } from 'react-hook-form'
import { Step3 } from '../src/features/aidForms/components/Step3'
import type { AidFormValues } from '../src/features/aidForms/types/aidFormTypes'

function Wrapper(props: Partial<Parameters<typeof Step3>[0]>) {
  const { register } = useForm<AidFormValues>()
  return (
    <Step3
      register={register}
      errors={props.errors ?? {}}
      onHelp={props.onHelp ?? (() => {})}
      loadingField={props.loadingField ?? null}
    />
  )
}

test('renders three textareas and help buttons', () => {
  render(<Wrapper />)

  expect(screen.getAllByRole('textbox')).toHaveLength(3)
  expect(screen.getAllByRole('button')).toHaveLength(3)
})

test('clicking help buttons calls onHelp with correct field', async () => {
  const user = userEvent.setup()
  const onHelp = vi.fn()
  render(<Wrapper onHelp={onHelp} />)

  const buttons = screen.getAllByRole('button')
  await user.click(buttons[0])
  await user.click(buttons[1])
  await user.click(buttons[2])

  expect(onHelp).toHaveBeenCalledTimes(3)
  expect(onHelp).toHaveBeenCalledWith('financialSituation')
  expect(onHelp).toHaveBeenCalledWith('employmentCircumstances')
  expect(onHelp).toHaveBeenCalledWith('applicationReason')
})

test('loadingField disables corresponding button and shows loading text', () => {
  render(<Wrapper loadingField="employmentCircumstances" />)

  const buttons = screen.getAllByRole('button')
  // second button corresponds to employmentCircumstances
  expect(buttons[1]).toBeDisabled()
  expect(buttons[1]).toHaveTextContent('loading')
})

test('shows required error when present in errors prop', () => {
  const errors = { financialSituation: { type: 'required' } }
  render(<Wrapper errors={errors as Parameters<typeof Step3>[0]['errors']} />)

  expect(screen.getByText('fieldRequired')).toBeInTheDocument()
})



