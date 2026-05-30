import CountriesRepo from '../repo/CountriesRepo'
import CountryModel from '../models/CountryModel'

class CountriesController {
  private countriesRepo: CountriesRepo

  constructor() {
    this.countriesRepo = new CountriesRepo()
    this.fetchCountries = this.fetchCountries.bind(this)
  }

  async fetchCountries(): Promise<CountryModel[]> {
    return this.countriesRepo.fetchCountries()
  }
}

export default CountriesController
