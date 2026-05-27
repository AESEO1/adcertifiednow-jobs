'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { isAIAvailable, promptAI } from '@/lib/ai'

const ELEMENTS = [
  'salary',
  'location',
  'requirements',
  'benefits',
  'contract type',
  'application instructions',
] as const

type Element = (typeof ELEMENTS)[number]

interface Props {
  value: string
}

export function JobDescriptionAssistant({ value }: Props) {
  const [missing, setMissing] = useState<Element[]>([])

  useEffect(() => {
    if (value.length < 50) {
      setMissing([])
      return
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      const available = await isAIAvailable()
      if (cancelled || !available) return

      try {
        const response = await promptAI(
          `Review this job description and list which of these elements are missing: salary, location, requirements, benefits, contract type, application instructions. Return as a JSON array of missing item names only, e.g. ["salary","location"]. Job description: ${value}`,
        )

        if (cancelled) return

        const start = response.indexOf('[')
        const end = response.lastIndexOf(']')

        if (start === -1 || end === -1) return

        const parsed: unknown = JSON.parse(response.slice(start, end + 1))

        if (!Array.isArray(parsed)) return

        const validated = parsed.filter((item): item is Element =>
          (ELEMENTS as readonly string[]).includes(item),
        )

        setMissing(validated)
      } catch {
        setMissing([])
      }
    }, 2000)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [value])

  if (missing.length === 0) return null

  return (
    <div className="mt-2">
      <p className="text-xs text-muted-foreground mb-1">
        Tips to improve your listing:
      </p>
      <div className="flex flex-wrap gap-1">
        {missing.map((item) => (
          <Badge key={item} variant="secondary">
            ✏️ Missing: {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}
