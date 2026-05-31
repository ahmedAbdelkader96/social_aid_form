import { apiClient } from '../../../shared/api/apiClients'
import { normalizeAxiosError } from '../../../shared/errors'
import { COUNTRIES_ENDPOINT } from '../../../shared/constants'
import CountryModel, { type CountryJSON } from '../models/CountryModel'

class CountriesRepo {
  async fetchCountries(): Promise<CountryModel[]> {
    try {
      const response = await apiClient.get<CountryJSON[]>(COUNTRIES_ENDPOINT)
      return response.data.map((country: CountryJSON) => CountryModel.fromJSON(country))
    } catch (error: unknown) {
      const apiError = normalizeAxiosError(error)
      console.error('Country lookup fetch failed:', apiError)
      throw new Error(apiError.message)
    }
  }
}

export default CountriesRepo
