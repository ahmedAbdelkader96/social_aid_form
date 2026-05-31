import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SelectMenu } from '../src/shared/ui/SelectMenu'

test('SelectMenu renders and triggers onChange', async () => {
  const user = userEvent.setup()
  const options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ]
  const handle = vi.fn()
  render(<SelectMenu id="sm" value="a" onValueChange={handle} options={options} />)

  const select = screen.getByRole('combobox') as HTMLSelectElement
  expect(select).toBeInTheDocument()
  await user.selectOptions(select, 'b')
  expect(handle).toHaveBeenCalledWith('b')
})
