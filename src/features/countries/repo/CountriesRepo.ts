import { apiClient } from '../../../global/api/apiClients'
import CountryModel, { type CountryJSON } from '../models/CountryModel'

const COUNTRIES_ENDPOINT = '/countries'

class CountriesRepo {
  async fetchCountries(): Promise<CountryModel[]> {
    const response = await apiClient.get<CountryJSON[]>(COUNTRIES_ENDPOINT)
    
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
