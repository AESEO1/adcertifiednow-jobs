"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { formatDate, stripHtml } from "@/lib/utils"
import type { Job } from "@/types"

interface PaginationData {
  jobs: Job[]
  hasNextPage: boolean
  currentPage: number
}

interface JobListingsClientProps {
  initialJobs?: Job[]
  initialHasNextPage?: boolean
}

export default function JobListingsClient({ initialJobs = [], initialHasNextPage = false }: JobListingsClientProps) {
  const searchParams = useSearchParams()
  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)

  const [data, setData] = useState<PaginationData>({
    jobs: initialJobs,
    hasNextPage: initialHasNextPage,
    currentPage: 1,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Skip fetch on page 1 if we have server-rendered initial data
    if (currentPage === 1 && initialJobs.length > 0) {
      setData({ jobs: initialJobs, hasNextPage: initialHasNextPage, currentPage: 1 })
      return
    }

    const fetchJobs = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/jobs?page=${currentPage}&limit=20`)
        const result = await response.json()
        setData({
          jobs: result.jobs || [],
          hasNextPage: result.hasNextPage || false,
          currentPage,
        })
      } catch {
        setData({ jobs: [], hasNextPage: false, currentPage })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const renderPagination = () => {
    const { currentPage, hasNextPage } = data
    const pages = []

    const maxPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
    const endPage = Math.min(startPage + maxPages - 1, currentPage + (hasNextPage ? 2 : 0))

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    if (currentPage > 1) {
      const prevUrl = currentPage - 1 === 1 ? "/" : `/?page=${currentPage - 1}`
      pages.push(
        <Link
          key="prev"
          href={prevUrl}
          rel="prev"
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
        >
          Previous
        </Link>,
      )
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageUrl = i === 1 ? "/" : `/?page=${i}`
      pages.push(
        <Link
          key={i}
          href={pageUrl}
          aria-current={i === currentPage ? "page" : undefined}
          className={`px-3 py-2 text-sm font-medium border ${
            i === currentPage
              ? "bg-blue-600 text-white border-blue-600"
              : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </Link>,
      )
    }

    if (hasNextPage) {
      pages.push(
        <Link
          key="next"
          href={`/?page=${currentPage + 1}`}
          rel="next"
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
        >
          Next
        </Link>,
      )
    }

    return (
      <div className="flex justify-center mt-8">
        <nav className="flex" aria-label="Pagination">
          {pages}
        </nav>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Latest Job Opportunities</h2>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Loading jobs...</p>
        </div>
      ) : data.jobs.length > 0 ? (
        <>
          <div className="grid gap-6">
            {data.jobs.map((job) => (
              <div key={job.guid} className="border rounded-lg p-6 hover:shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      <Link href={`/jobs/${job.guid}`} className="text-blue-600 hover:underline">
                        {job.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600">
                      {job.employer} • {job.location}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{formatDate(job.post_date)}</span>
                </div>
                <p className="text-gray-700 mb-4">{stripHtml(job.description)?.substring(0, 150)}...</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {job.contract_type || "Full-time"}
                    </span>
                    {job.salary_display && (
                      <span className="text-green-600 font-semibold text-sm">{job.salary_display}</span>
                    )}
                  </div>
                  <Link href={`/jobs/${job.guid}`} className="text-blue-600 hover:underline font-medium">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {renderPagination()}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No job listings available at the moment.</p>
          <p className="text-gray-500 mt-2">Please check back later or try searching for specific positions.</p>
        </div>
      )}
    </main>
  )
}
