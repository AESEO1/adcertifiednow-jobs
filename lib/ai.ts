export async function isAIAvailable(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ai) return false
  try {
    const availability = await window.ai.languageModel.availability()
    return availability === 'available'
  } catch {
    return false
  }
}

export async function promptAI(prompt: string): Promise<string> {
  if (!window.ai) throw new Error('AI API not available')
  const session = await window.ai.languageModel.create()
  try {
    return await session.prompt(prompt)
  } finally {
    session.destroy()
  }
}

export async function streamAI(prompt: string): Promise<ReadableStream> {
  if (!window.ai) throw new Error('AI API not available')
  const session = await window.ai.languageModel.create()
  const stream = session.promptStreaming(prompt)
  const reader = stream.getReader()
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read()
        if (done) {
          controller.close()
          session.destroy()
        } else {
          controller.enqueue(value)
        }
      } catch (error) {
        session.destroy()
        controller.error(error)
      }
    },
    cancel() {
      reader.cancel()
      session.destroy()
    },
  })
}
