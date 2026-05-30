// Dependency injection root.
// Composes concrete controllers and service implementations for use across the app.

import ApplicationRepo from '../features/application/repo/ApplicationRepo'
import ApplicationController from '../features/application/controller/ApplicationController'
import CountriesRepo from '../features/countries/repo/CountriesRepo'
import CountriesController from '../features/countries/controller/CountriesController'

export const applicationController = new ApplicationController(new ApplicationRepo())
export const countriesController = new CountriesController(new CountriesRepo())
