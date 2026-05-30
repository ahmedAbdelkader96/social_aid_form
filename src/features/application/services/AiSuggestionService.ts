// Application service implementations.
// Implements domain services like AI suggestion generation for the application feature.

import { generateOpenAISuggestion } from '../../../shared/api/openAiClient'
import type { IAiSuggestionService } from '../domain/ports/IAiSuggestionService'

export class AiSuggestionService implements IAiSuggestionService {
  async generateSuggestion(field: string, currentValues: unknown, promptOverride?: string): Promise<string> {
    return generateOpenAISuggestion(field, currentValues, promptOverride)
  }
}

export const aiSuggestionService = new AiSuggestionService()
