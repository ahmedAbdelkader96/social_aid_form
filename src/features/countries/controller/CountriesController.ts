/**
 * Controller for countries data retrieval.
 * Separates request orchestration from component concerns and supports dependency injection for tests.
 */
import CountriesRepo from '../repo/CountriesRepo'
import CountryModel from '../models/CountryModel'

class CountriesController {
  private countriesRepo: CountriesRepo

  constructor(countriesRepo: CountriesRepo = new CountriesRepo()) {
    this.countriesRepo = countriesRepo
  }

  async fetchCountries(): Promise<CountryModel[]> {
    return this.countriesRepo.fetchCountries()
  }
}

export default CountriesController
