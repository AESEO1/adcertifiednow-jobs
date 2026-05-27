"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Building2, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import AISearchBar from "@/components/ai/AISearchBar"
import { formatDate, stripHtml } from "@/lib/utils"
import type { Job } from "@/types"

interface SearchParams {
  q?: string
  page?: string
  city?: string
  state?: string
}

interface SearchContentProps {
  searchParams: SearchParams
  initialJobs: Job[]
  initialHasNextPage: boolean
  hideHero?: boolean
}

function SearchContent({ searchParams, initialJobs, initialHasNextPage, hideHero }: SearchContentProps) {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number(searchParams.page) || 1)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)

  // Fetch jobs when page changes (page 1 is already server-rendered)
  useEffect(() => {
    if (currentPage === 1) {
      setJobs(initialJobs)
      setHasNextPage(initialHasNextPage)
      return
    }

    const performSearch = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchParams.q) params.set("q", searchParams.q)
        params.set("page", currentPage.toString())
        params.set("limit", "20")
        if (searchParams.city) params.set("city", searchParams.city)
        if (searchParams.state) params.set("state", searchParams.state)

        const response = await fetch(`/api/search?${params.toString()}`)
        if (!response.ok) throw new Error("Search request failed")
        const data = await response.json()
        setJobs(data.jobs || [])
        setHasNextPage(data.hasNextPage || false)
      } catch (err) {
        console.error("Search error:", err)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (query: string, _location: string) => {
    if (query.trim()) {
      router.push(`/search/q/${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <>
      {!hideHero && (
        <section className="bg-blue-700 bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 !text-white drop-shadow-lg">Find Your Perfect Job</h1>
            <p className="text-xl md:text-2xl mb-8 !text-white drop-shadow-md">
              Search thousands of opportunities across the United States
            </p>
            <div className="max-w-2xl mx-auto">
              <AISearchBar
                initialQuery={searchParams.q}
                onSearch={handleSearch}
              />
            </div>
          </div>
        </section>
      )}

      {/* Job Listings */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">
          {searchParams.q ? `Search Results for "${searchParams.q}"` : "Job Search Results"}
        </h2>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">
                            <Link href={`/jobs/${job.guid}`} className="hover:text-primary transition-colors">

                              {job.title}
                            </Link>
                          </CardTitle>
                          <div className="flex items-center space-x-4 text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Building2 className="w-4 h-4" />
                              <span>{job.employer}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-muted-foreground mb-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{formatDate(job.post_date)}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {stripHtml(job.description)?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {job.contract_type || "Full-time"}
                      </span>
                      <Link href={`/jobs/${job.guid}`} className="text-blue-600 hover:underline font-medium">
                        View Details →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {(currentPage > 1 || hasNextPage) && (
              <div className="flex items-center justify-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    const newPage = currentPage - 1
                    router.push(`/search/q/${encodeURIComponent(searchParams.q || "")}?page=${newPage}`)
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <span className="text-muted-foreground">Page {currentPage}</span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNextPage}
                  onClick={() => {
                    const newPage = currentPage + 1
                    router.push(`/search/q/${encodeURIComponent(searchParams.q || "")}?page=${newPage}`)
                  }}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : searchParams.q ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No jobs found for "{searchParams.q}"</p>
            <p className="text-gray-500 mt-2">Try different keywords or browse all available jobs</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Enter search criteria to find jobs</p>
          </div>
        )}
      </main>
    </>
  )
}

export default function SearchClientPage({ searchParams, initialJobs, initialHasNextPage, hideHero }: SearchContentProps) {
  return <SearchContent searchParams={searchParams} initialJobs={initialJobs} initialHasNextPage={initialHasNextPage} hideHero={hideHero} />
}
