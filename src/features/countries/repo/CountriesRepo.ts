import { apiClient } from '../../../shared/api/apiClients'
import { COUNTRIES_ENDPOINT } from '../../../shared/constants'
import CountryModel, { type CountryJSON } from '../models/CountryModel'

class CountriesRepo {
  async fetchCountries(): Promise<CountryModel[]> {
    const response = await apiClient.get<CountryJSON[]>(COUNTRIES_ENDPOINT)

    return response.data.map((country: CountryJSON) => CountryModel.fromJSON(country))
  }
}

export default CountriesRepo
