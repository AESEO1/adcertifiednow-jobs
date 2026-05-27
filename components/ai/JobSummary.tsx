'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { isAIAvailable, streamAI } from '@/lib/ai'

interface JobSummaryProps {
  description: string
}

export default function JobSummary({ description }: JobSummaryProps) {
  const [bullets, setBullets] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const cancelRef = useRef(false)

  useEffect(() => {
    cancelRef.current = false
    let reader: ReadableStreamDefaultReader | null = null

    async function run() {
      const available = await isAIAvailable()
      if (!available || cancelRef.current) return
      setShow(true)
      setLoading(true)

      try {
        const stream = await streamAI(
          `Summarise this job description in exactly 3 bullet points, each under 15 words. Return as a plain numbered list like "1. ...", no intro text: ${description.substring(0, 3000)}`
        )
        reader = stream.getReader()
        let text = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done || cancelRef.current) break
          text += value
          const lines = text
            .split('\n')
            .map(l => l.replace(/^\d+\.\s*/, '').trim())
            .filter(Boolean)
          setBullets(lines.slice(0, 3))
        }
      } catch {
        // silent failure
      } finally {
        setLoading(false)
      }
    }

    run()
    return () => {
      cancelRef.current = true
      reader?.cancel()
    }
  }, [description])

  if (!show) return null

  return (
    <Card>
      <CardHeader>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          <span>✨</span>
          <span>AI Summary</span>
        </h2>
      </CardHeader>
      <CardContent>
        {loading && bullets.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '16px', backgroundColor: '#f3f4f6', borderRadius: '4px', animation: 'pulse 2s infinite' }} />
            ))}
          </div>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, paddingLeft: '20px', color: '#374151' }}>
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
