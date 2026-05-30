// Countries controller layer.
// Coordinates country data fetching and maps repository results to the feature.

import type { ICountriesRepository } from '../domain/ports/ICountriesRepository'
import CountryModel from '../models/CountryModel'

class CountriesController {
  private countriesRepo: ICountriesRepository

  constructor(countriesRepo: ICountriesRepository) {
    this.countriesRepo = countriesRepo
    this.fetchCountries = this.fetchCountries.bind(this)
  }

  async fetchCountries(): Promise<CountryModel[]> {
    return this.countriesRepo.fetchCountries()
  }
}

export default CountriesController
