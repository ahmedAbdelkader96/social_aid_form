/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { vi } from 'vitest'
import { useStepNavigation } from '../src/features/aidForms/hooks/useStepNavigation'
import * as React from 'react'
import { AID_FORM_STEP } from '../src/features/aidForms/types/aidFormTypes'
import { Step1 } from '../src/features/aidForms/components/Step1'
import { AidForm } from '../src/features/aidForms/AidForm'
import type { AidFormValues } from '../src/features/aidForms/types/aidFormTypes'
import type { TFunction } from 'i18next'

vi.mock('../src/features/countries/hooks/useCountries', () => ({
  useCountries: () => ({ countries: [], loading: false }),
}))
vi.mock('../src/app/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: (selector: (state: any) => unknown) =>
    selector({
      aidForm: {
        currentStep: 1,
        language: 'en',
        form: {
          name: '',
          nationalId: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          city: '',
          state: '',
          countryCode: '',
          dialCode: '',
          phone: '',
          email: '',
          maritalStatus: '',
          dependents: 0,
          employmentStatus: '',
          monthlyIncome: 0,
          housingStatus: '',
          financialSituation: '',
          employmentCircumstances: '',
          applicationReason: '',
        },
        submitStatus: 'idle',
        submitError: null,
      },
      countries: {
        items: [],
        locale: 'en',
        status: 'idle',
        error: null,
        lastFetchedAt: null,
      },
    }),
}))
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}))

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  },
}))

function TestStepNavigation() {
  const dispatch = vi.fn()
  const [toast, setToast] = useState<string>('')
  const {
    register,
    trigger,
    getValues,
    formState,
  } = useForm<AidFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      nationalId: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      countryCode: '',
      dialCode: '',
      phone: '',
      email: '',
      maritalStatus: '',
      dependents: 0,
      employmentStatus: '',
      monthlyIncome: 0,
      housingStatus: '',
      financialSituation: '',
      employmentCircumstances: '',
      applicationReason: '',
    },
  })

  const t = ((key: string, options?: Record<string, string>) => {
    if (key === 'fieldRequired' && options?.field) {
      return `${options.field} is required.`
    }

    switch (key) {
      case 'name':
        return 'Name'
      case 'nationalId':
        return 'National ID'
      case 'dateOfBirth':
        return 'Date of Birth'
      case 'gender':
        return 'Gender'
      case 'address':
        return 'Address'
      case 'city':
        return 'City'
      case 'state':
        return 'State'
      case 'countryCode':
        return 'Country'
      case 'dialCode':
        return 'Dial code'
      case 'phone':
        return 'Phone'
      case 'email':
        return 'Email'
      default:
        return key
    }
  }) as TFunction

  const { handleNext } = useStepNavigation({
    currentStep: AID_FORM_STEP.step1,
    dispatch,
    trigger,
    getValues,
    getCurrentErrors: () => formState.errors,
    t,
    showToast: (message: string) => setToast(message),
  })

  return (
    <div>
      <form>
        <input {...register('name', { required: true })} placeholder="name" aria-label="name" />
        <input {...register('nationalId', { required: true })} placeholder="nationalId" aria-label="nationalId" />
        <input {...register('dateOfBirth', { required: true })} placeholder="dateOfBirth" aria-label="dateOfBirth" />
        <input {...register('gender', { required: true })} placeholder="gender" aria-label="gender" />
        <input {...register('address', { required: true })} placeholder="address" aria-label="address" />
        <input {...register('city', { required: true })} placeholder="city" aria-label="city" />
        <input {...register('state', { required: true })} placeholder="state" aria-label="state" />
        <input {...register('countryCode', { required: true })} placeholder="countryCode" aria-label="countryCode" />
        <input {...register('dialCode', { required: true })} placeholder="dialCode" aria-label="dialCode" />
        <input {...register('phone', { required: true })} placeholder="phone" aria-label="phone" />
        <input {...register('email', { required: true })} placeholder="email" aria-label="email" />
      </form>
      <button type="button" onClick={handleNext}>
        Next
      </button>
      <div role="status">{toast}</div>
    </div>
  )
}

function TestStep1WithRealStep() {
  const dispatch = vi.fn()
  const [toast, setToast] = useState<string>('')

  const {
    register,
    trigger,
    control,
    getValues,
    setValue,
    formState,
    clearErrors,
  } = useForm<AidFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      nationalId: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      city: '',
      state: '',
      countryCode: '',
      dialCode: '',
      phone: '',
      email: '',
      maritalStatus: '',
      dependents: 0,
      employmentStatus: '',
      monthlyIncome: 0,
      housingStatus: '',
      financialSituation: '',
      employmentCircumstances: '',
      applicationReason: '',
    },
  })

  const t = ((key: string, options?: Record<string, string>) => {
    if (key === 'fieldRequired' && options?.field) {
      return `${options.field} is required.`
    }

    switch (key) {
      case 'name':
        return 'Name'
      case 'nationalId':
        return 'National ID'
      case 'dateOfBirth':
        return 'Date of Birth'
      case 'gender':
        return 'Gender'
      case 'address':
        return 'Address'
      case 'city':
        return 'City'
      case 'state':
        return 'State'
      case 'countryCode':
        return 'Country'
      case 'dialCode':
        return 'Dial code'
      case 'phone':
        return 'Phone'
      case 'email':
        return 'Email'
      default:
        return key
    }
  }) as TFunction

  const { handleNext } = useStepNavigation({
    currentStep: AID_FORM_STEP.step1,
    dispatch,
    trigger,
    getValues,
    getCurrentErrors: () => formState.errors,
    t,
    showToast: (message: string) => setToast(message),
  })

  return (
    <div>
      <form>
        <Step1
          register={register}
          control={control}
          setValue={setValue}
          trigger={trigger}
          errors={formState.errors}
          clearErrors={clearErrors}
          dismissToast={() => setToast('')}
        />
      </form>
      <button type="button" onClick={handleNext}>
        Next
      </button>
      <div role="status">{toast}</div>
    </div>
  )
}

function TestAidFormFull() {
  return <AidForm />
}

test('Step1 validation advances to nationalId when name is filled', async () => {
  render(<TestStepNavigation />)

  const nameInput = screen.getByLabelText('name') as HTMLInputElement
  const nextButton = screen.getByRole('button', { name: /next/i })

  fireEvent.change(nameInput, { target: { value: 'John Doe' } })
  fireEvent.click(nextButton)

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('National ID is required.')
  })
})

test('Step1 validation shows name first when no fields are entered', async () => {
  render(<TestStepNavigation />)

  const nextButton = screen.getByRole('button', { name: /next/i })
  fireEvent.click(nextButton)

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('Name is required.')
  })
})

test('Real Step1 component validation shows nationalId when name is filled', async () => {
  render(<TestStep1WithRealStep />)

  const nameInput = screen.getByRole('textbox', { name: /name/i }) as HTMLInputElement
  const nextButton = screen.getByRole('button', { name: /next/i })

  fireEvent.change(nameInput, { target: { value: 'John Doe' } })
  fireEvent.click(nextButton)

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('National ID is required.')
  })
})

test('Real Step1 component validation requires all fields before advancing', async () => {
  render(<TestStep1WithRealStep />)

  const phoneInput = screen.getByPlaceholderText('123 456 7890') as HTMLInputElement
  const nextButton = screen.getByRole('button', { name: /next/i })

  fireEvent.change(phoneInput, { target: { value: '1234567890' } })
  fireEvent.click(nextButton)

  await waitFor(() => {
    expect(screen.getByRole('status')).toHaveTextContent('Name is required.')
  })
})

test('Full AidForm integration logs values and errors on Next', async () => {
  const debug = vi.spyOn(console, 'debug').mockImplementation(() => {})
  render(<TestAidFormFull />)

  const nameInput = screen.getByRole('textbox', { name: /name/i }) as HTMLInputElement
  const nextButton = screen.getByRole('button', { name: /next/i })

  fireEvent.change(nameInput, { target: { value: 'John Doe' } })
  fireEvent.click(nextButton)

  await waitFor(() => {
    expect(debug).toHaveBeenCalled()
  })

  const lastCall = debug.mock.calls[debug.mock.calls.length - 1]
   
  console.log('debug-call', lastCall)
  debug.mockRestore()
})
