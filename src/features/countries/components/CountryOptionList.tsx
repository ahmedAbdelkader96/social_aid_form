import type { FC } from 'react'
import type CountryModel from '../models/CountryModel'

interface Props {
  options: CountryModel[]
  loading?: boolean
  noResultsText?: string
  ulClassName?: string
  itemClassName?: string
  flagClassName?: string
  primaryClassName?: string
  onSelect: (entry: CountryModel) => void
  getLocaleName: (entry: CountryModel | null | undefined) => string
}

export const CountryOptionList: FC<Props> = ({
  options,
  loading,
  noResultsText,
  ulClassName,
  itemClassName,
  flagClassName,
  primaryClassName,
  onSelect,
  getLocaleName,
}) => {
  return (
    <ul className={ulClassName} role="listbox">
      {loading ? (
        <li className={itemClassName}>{'loading'}</li>
      ) : options.length > 0 ? (
        options.map((entry) => (
          <li
            key={entry.code}
            className={itemClassName}
            onMouseDown={() => onSelect(entry)}
            role="option"
          >
            {entry.flagUrl ? (
              <img src={entry.flagUrl} alt={getLocaleName(entry)} className={flagClassName} />
            ) : (
              <span className={flagClassName}>🌍</span>
            )}
            <div>
              <span className={primaryClassName}>{getLocaleName(entry)}</span>
            </div>
          </li>
        ))
      ) : (
        <li className={itemClassName}>{noResultsText}</li>
      )}
    </ul>
  )
}

export default CountryOptionList
