'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { isAIAvailable, promptAI } from '@/lib/ai'

interface SkillsBadgesProps {
  description: string
}

export default function SkillsBadges({ description }: SkillsBadgesProps) {
  const [skills, setSkills] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    async function run() {
      const available = await isAIAvailable()
      if (!available) return
      try {
        const raw = await promptAI(
          `Extract up to 8 required skills or technologies from this job description. Return as a JSON array of short strings only, no explanation: ${description.substring(0, 3000)}`
        )
        if (cancelled) return
        const parsed = JSON.parse(raw.trim().replace(/```json|```/g, ''))
        if (Array.isArray(parsed)) setSkills(parsed.slice(0, 8))
      } catch {
        // silent
      }
    }
    run()
    return () => { cancelled = true }
  }, [description])

  if (skills.length === 0) return null

  return (
    <>
      <Separator style={{ margin: '4px 0' }} />
      {skills.map(skill => (
        <Badge key={skill} variant="secondary" style={{ fontSize: '13px' }}>
          {skill}
        </Badge>
      ))}
    </>
  )
}
