// Countries repository abstractions.
// Defines an interface for country data access used by the countries feature.

import type CountryModel from '../../models/CountryModel'

export interface ICountriesRepository {
  fetchCountries(): Promise<CountryModel[]>
}
