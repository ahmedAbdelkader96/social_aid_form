import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { fetchCountriesAsync } from '../stores'

export function useCountries() {
  const dispatch = useAppDispatch()
  const countries = useAppSelector((state) => state.countries)

  useEffect(() => {
    if (countries.status === 'idle') {
      dispatch(fetchCountriesAsync())
    }
  }, [countries.status, dispatch])

  return {
    countries: countries.items,
    loading: countries.status === 'loading',
    error: countries.error,
  }
}
