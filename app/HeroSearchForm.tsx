"use client"

import AISearchBar from "@/components/ai/AISearchBar"

export default function HeroSearchForm() {
  function handleSearch(query: string, location: string) {
    const path = `/search/q/${encodeURIComponent(query.trim())}`
    window.location.href = path
  }

  return <AISearchBar onSearch={handleSearch} />
}
