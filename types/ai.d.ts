interface AILanguageModelSession {
  prompt(input: string): Promise<string>
  promptStreaming(input: string): ReadableStream
  destroy(): void
}

interface AILanguageModel {
  availability(): Promise<'available' | 'downloading' | 'unavailable'>
  create(options?: { systemPrompt?: string }): Promise<AILanguageModelSession>
}

interface AI {
  languageModel: AILanguageModel
}

declare global {
  interface Window {
    ai?: AI
  }
}

export {}
