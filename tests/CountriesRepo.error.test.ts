import { vi, expect, test } from 'vitest'

vi.mock('../src/shared/api/apiClients', () => ({
  apiClient: { get: vi.fn(() => Promise.reject(new Error('Network error'))) },
}))

import CountriesRepo from '../src/features/countries/repo/CountriesRepo'

test('CountriesRepo.fetchCountries rejects on API error', async () => {
  const repo = new CountriesRepo()
  await expect(repo.fetchCountries()).rejects.toThrow('Network error')
})
