import { parseAiSuggestion } from '../src/features/aidForms/utils/parseAiSuggestion'

describe('parseAiSuggestion', () => {
  test('extracts text inside double quotes', () => {
    const input = 'You could say: "I lost my job last month and have no income."'
    expect(parseAiSuggestion(input, 'financialSituation')).toBe('I lost my job last month and have no income.')
  })

  test('extracts text inside single quotes', () => {
    const input = "Here's a suggestion: 'I am struggling to pay rent due to layoffs.'"
    expect(parseAiSuggestion(input, 'financialSituation')).toBe('I am struggling to pay rent due to layoffs.')
  })

  test('takes clause after common phrase', () => {
    const input = 'You could try: I support my family on occasional work. The situation is worsening.'
    expect(parseAiSuggestion(input, 'employmentCircumstances')).toBe('I support my family on occasional work')
  })

  test('falls back to original when no patterns match', () => {
    const input = 'I have limited income.'
    expect(parseAiSuggestion(input, 'applicationReason')).toBe('I have limited income.')
  })
})



