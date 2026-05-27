'use client'

import { useEffect, useState } from 'react'
import { isAIAvailable, promptAI } from '@/lib/ai'
import { Button } from '@/components/ui/button'

interface TitleNormaliserProps {
  value: string
  onAccept: (normalised: string) => void
}

export default function TitleNormaliser({ value, onAccept }: TitleNormaliserProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null)

  useEffect(() => {
    if (!value.trim()) {
      setSuggestion(null)
      return
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      const available = await isAIAvailable()
      if (cancelled || !available) return

      const prompt = `Normalise this job title to a clean, professional format for job listings. Return only the normalised title, nothing else: ${value}`

      try {
        const result = await promptAI(prompt)
        const normalised = result.trim()
        if (!cancelled && normalised && normalised !== value) {
          setSuggestion(normalised)
        } else if (!cancelled) {
          setSuggestion(null)
        }
      } catch {
        if (!cancelled) setSuggestion(null)
      }
    }, 500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [value])

  if (!suggestion) return null

  return (
    <span className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
      Suggested: {suggestion}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onAccept(suggestion)
          setSuggestion(null)
        }}
      >
        Accept
      </Button>
    </span>
  )
}
