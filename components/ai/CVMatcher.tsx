'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { isAIAvailable, streamAI } from '@/lib/ai'

interface CVMatcherProps {
  jobDescription: string
  jobTitle: string
}

export function CVMatcherButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    isAIAvailable().then(setShow)
  }, [])

  if (!show) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => document.getElementById('cv-matcher')?.scrollIntoView({ behavior: 'smooth' })}
        style={{ fontSize: '13px', color: '#6b7280' }}
      >
        ✨ Match my CV ↓
      </Button>
    </div>
  )
}

export function CVMatcherCard({ jobDescription, jobTitle }: CVMatcherProps) {
  const [show, setShow] = useState(false)
  const [cv, setCv] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const cancelRef = useRef(false)

  useEffect(() => {
    isAIAvailable().then(setShow)
  }, [])

  if (!show) return null

  async function handleCheck() {
    if (!cv.trim()) return
    cancelRef.current = false
    setLoading(true)
    setResult('')
    try {
      const stream = await streamAI(
        `Score this CV against this job description. Return:
1) A percentage match score (e.g. "Match: 72%")
2) Up to 5 matching skills (label "Matching skills:")
3) Up to 5 skill gaps (label "Gaps:")

CV:
${cv.substring(0, 4000)}

Job Description:
${jobDescription.substring(0, 3000)}`
      )
      const reader = stream.getReader()
      let text = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done || cancelRef.current) break
        text += value
        setResult(text)
      }
    } catch {
      setResult('Unable to analyse CV — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card id="cv-matcher">
      <CardHeader>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
          <span>✨</span>
          <span>Match my CV to {jobTitle}</span>
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
          Paste your CV below — analysis happens entirely in your browser, nothing is sent anywhere.
        </p>
      </CardHeader>
      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <textarea
          value={cv}
          onChange={e => setCv(e.target.value)}
          placeholder="Paste your CV text here..."
          rows={8}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#111827',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
        <Button
          onClick={handleCheck}
          disabled={loading || !cv.trim()}
          style={{ backgroundColor: '#2563eb', color: 'white', alignSelf: 'flex-start' }}
        >
          {loading ? 'Analysing...' : 'Check Match'}
        </Button>
        {result && (
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            color: '#374151',
            backgroundColor: '#f9fafb',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            margin: 0,
          }}>
            {result}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
