import { forwardRef, type ChangeEvent, type SelectHTMLAttributes } from 'react'

export interface Option {
  value: string
  label: string
}

export interface SelectMenuProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[]
  onValueChange?: (value: string) => void
}

export const SelectMenu = forwardRef<HTMLSelectElement, SelectMenuProps>(function SelectMenu(
  { options, className, onValueChange, onChange, ...rest },
  ref,
) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  return (
    <select
      ref={ref}
      className={className}
      onChange={handleChange}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
})

export default SelectMenu
