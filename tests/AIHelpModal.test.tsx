import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { AIHelpModal } from '../src/features/aidForms/components/AIHelpModal'

test('renders suggestion and calls handlers', async () => {
  const onClose = vi.fn()
  const onAccept = vi.fn()
  render(
    <AIHelpModal
      visible={true}
      title="AI Suggestion"
      value="This is an AI suggestion"
      loading={false}
      onClose={onClose}
      onAccept={onAccept}
      onDiscard={() => {}}
      onChange={() => {}}
    />
  )

  // Assert suggestion is present in the textarea (role textbox)
  const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
  expect(textarea).toHaveValue('This is an AI suggestion')

  // Interact: click the Accept button using userEvent.setup()
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: /accept/i }))

  // Verify handler called
  expect(onAccept).toHaveBeenCalled()
})


