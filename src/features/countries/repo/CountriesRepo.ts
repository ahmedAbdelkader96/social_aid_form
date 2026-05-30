// Countries repositories.
// Handles HTTP requests and data mapping for country resources.
// Countries repository.

import { apiClient } from '../../../shared/api/apiClients'
import CountryModel, { type CountryJSON } from '../models/CountryModel'
import API_ENDPOINTS from '../../../shared/constants/apiEndpoints'
import type { ICountriesRepository } from '../domain/ports/ICountriesRepository'

class CountriesRepo implements ICountriesRepository {
  async fetchCountries(): Promise<CountryModel[]> {
    const response = await apiClient.get<CountryJSON[]>(API_ENDPOINTS.COUNTRIES)
    
    console.log('📡 API Response:', response.data)
    console.log('Total countries:', response.data.length)
    console.log('First country:', response.data[0])

    const mapped = response.data.map((country: CountryJSON) => {
      return CountryModel.fromJSON(country)
    })
    
    console.log('✅ Mapped Countries:', mapped)
    console.log('First mapped:', mapped[0])
    
    return mapped
  }
}

export default CountriesRepo
