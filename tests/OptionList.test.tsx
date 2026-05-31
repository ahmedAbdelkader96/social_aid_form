import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CountryOptionList from '../src/features/countries/components/CountryOptionList'
import DialCodeOptionList from '../src/features/countries/components/DialCodeOptionList'

import CountryModel from '../src/features/countries/models/CountryModel'

const mockOptions: CountryModel[] = [
  new CountryModel({ code: 'AA', nameEn: 'A', nameAr: 'أ', dialCode: '+1', flagUrl: '' }),
  new CountryModel({ code: 'BB', nameEn: 'B', nameAr: 'ب', dialCode: '+2', flagUrl: '' }),
]

test('CountryOptionList renders country names and calls onSelect', async () => {
  const user = userEvent.setup()
  const handle = vi.fn()
  render(
    <CountryOptionList
      options={mockOptions}
      loading={false}
      noResultsText={'none'}
      ulClassName={''}
      itemClassName={''}
      flagClassName={''}
      primaryClassName={''}
      onSelect={handle}
      getLocaleName={(e) => (e ? e.nameEn : '')}
    />
  )

  const items = screen.getAllByRole('option')
  expect(items).toHaveLength(2)
  await user.pointer({ keys: '[MouseLeft]', target: items[0] })
  expect(handle).toHaveBeenCalled()
})

test('DialCodeOptionList renders dial codes and calls onSelect', async () => {
  const user = userEvent.setup()
  const handle = vi.fn()
  render(
    <DialCodeOptionList
      options={mockOptions}
      loading={false}
      noResultsText={'none'}
      ulClassName={''}
      itemClassName={''}
      flagClassName={''}
      primaryClassName={''}
      secondaryClassName={''}
      onSelect={handle}
      getLocaleName={(e) => (e ? e.nameEn : '')}
    />
  )

  const items = screen.getAllByRole('option')
  expect(items).toHaveLength(2)
  await user.pointer({ keys: '[MouseLeft]', target: items[0] })
  expect(handle).toHaveBeenCalled()
})
