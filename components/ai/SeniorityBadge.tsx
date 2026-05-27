'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { isAIAvailable, promptAI } from '@/lib/ai'

const VALID = ['Junior', 'Mid', 'Senior', 'Lead']

const COLOURS: Record<string, string> = {
  Junior: '#dcfce7',
  Mid: '#dbeafe',
  Senior: '#fef9c3',
  Lead: '#fce7f3',
}

interface SeniorityBadgeProps {
  title: string
  description: string
}

export default function SeniorityBadge({ title, description }: SeniorityBadgeProps) {
  const [seniority, setSeniority] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const available = await isAIAvailable()
      if (!available) return
      try {
        const result = await promptAI(
          `What seniority level is this job? Reply with exactly one word: Junior, Mid, Senior, or Lead. Title: ${title} Description: ${description.substring(0, 1000)}`
        )
        if (cancelled) return
        const word = result.trim().split(/\s/)[0]
        if (VALID.includes(word)) setSeniority(word)
      } catch {
        // silent
      }
    }
    run()
    return () => { cancelled = true }
  }, [title, description])

  if (!seniority) return null

  return (
    <>
      <dt style={{ color: '#6b7280', fontWeight: '500' }}>Seniority</dt>
      <dd style={{ fontWeight: '600', margin: 0 }}>
        <Badge style={{ backgroundColor: COLOURS[seniority], color: '#111827', border: 'none' }}>
          {seniority}
        </Badge>
      </dd>
    </>
  )
}
