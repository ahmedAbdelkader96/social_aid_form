// Application domain ports.
// Defines abstractions for repositories and services used by application controllers.
// Application domain port interface.

export interface IAiSuggestionService {
  generateSuggestion(field: string, currentValues: unknown, promptOverride?: string): Promise<string>
}
