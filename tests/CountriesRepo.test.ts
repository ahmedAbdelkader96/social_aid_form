import { vi, expect, test } from 'vitest'
vi.mock('../src/shared/api/apiClients', () => ({ apiClient: { get: vi.fn() } }))

import CountriesRepo from '../src/features/countries/repo/CountriesRepo'
import type { Mock } from 'vitest'

test('CountriesRepo.fetchCountries maps API response', async () => {
  const mockData = [
    { code: 'XX', nameEn: 'CountryX', nameAr: 'دولةX', dialCode: '+99', flagUrl: '' },
  ]

  const { apiClient } = await import('../src/shared/api/apiClients')
  const apiGet = apiClient.get as unknown as Mock
  apiGet.mockResolvedValue({ data: mockData })

  const repo = new CountriesRepo()
  const result = await repo.fetchCountries()
  expect(result).toHaveLength(1)
  expect(result[0].code).toBe('XX')
})
