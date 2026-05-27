'use client'

import { useState, useEffect } from 'react'
import { isAIAvailable, promptAI } from '@/lib/ai'

interface AISearchBarProps {
  initialQuery?: string
  initialLocation?: string
  onSearch: (query: string, location: string) => void
}

interface ParsedQuery {
  keywords: string
  location: string | null
  category: string | null
  contractType: string | null
  minSalary: number | null
}

export default function AISearchBar({ initialQuery = '', initialLocation = '', onSearch }: AISearchBarProps) {
  const [aiAvailable, setAiAvailable] = useState(false)
  const [aiMode, setAiMode] = useState(false)
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const available = await isAIAvailable()
      if (!cancelled) setAiAvailable(available)
    }
    run()
    return () => { cancelled = true }
  }, [])

  async function expandKeywords(keywords: string): Promise<string> {
    try {
      const raw = await promptAI(
        `List up to 4 common job title synonyms for '${keywords}' as a JSON array of short strings. Return only the array.`
      )
      const trimmed = raw.trim()
      const start = trimmed.indexOf('[')
      const end = trimmed.lastIndexOf(']')
      if (start === -1 || end === -1) return keywords
      const synonyms: unknown = JSON.parse(trimmed.slice(start, end + 1))
      if (!Array.isArray(synonyms)) return keywords
      const terms = [keywords, ...(synonyms as string[]).filter((s) => typeof s === 'string')]
      return terms.join(' ')
    } catch {
      return keywords
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)

    let resolvedKeywords = query.trim()
    let resolvedLocation = location.trim()

    try {
      if (aiMode && query.trim().split(/\s+/).length > 3) {
        const raw = await promptAI(
          `Parse this job search query into JSON with keys: keywords (string), location (string or null), category (string or null), contractType (string or null), minSalary (number or null). Query: ${query}`
        )
        const trimmed = raw.trim()
        const start = trimmed.indexOf('{')
        const end = trimmed.lastIndexOf('}')
        if (start !== -1 && end !== -1) {
          const parsed: ParsedQuery = JSON.parse(trimmed.slice(start, end + 1))
          if (parsed.keywords) resolvedKeywords = parsed.keywords
          if (parsed.location && !resolvedLocation) resolvedLocation = parsed.location
        }
      }

      if (aiAvailable) {
        resolvedKeywords = await expandKeywords(resolvedKeywords)
      }
    } catch {
      // fall back to literal input values
    }

    setLoading(false)
    onSearch(resolvedKeywords, resolvedLocation)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={aiMode ? 'Describe the job you\'re looking for...' : 'Search job titles...'}
          className="flex-1 px-4 py-3 rounded-lg text-gray-900"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-48 px-4 py-3 rounded-lg text-gray-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>
      {aiAvailable && (
        <button
          type="button"
          onClick={() => setAiMode((prev) => !prev)}
          className={`self-start text-sm ${aiMode ? 'text-orange-600 font-medium' : 'text-gray-500 hover:text-orange-500'}`}
        >
          {aiMode ? '✨ AI search on' : '✨ AI search'}
        </button>
      )}
    </form>
  )
}
