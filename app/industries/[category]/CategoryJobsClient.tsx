"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Building, Calendar, DollarSign, ChevronLeft, ChevronRight } from "lucide-react"
import PageLayout from "@/components/layout/PageLayout"
import { categoryToSlug } from "@/lib/category-slug"

interface Job {
  guid: any
  id: string
  title: string
  employer: string
  location: string
  location_raw?: string
  salary?: string
  salary_display?: string
  post_date: string
  category?: string
  contract_type?: string
  contract_time?: string
  description?: string
}

interface CategoryJobsClientProps {
  category: string
  initialPage: number
  initialJobs: Job[]
}

export default function CategoryJobsClient({ category, initialPage, initialJobs }: CategoryJobsClientProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [hasNextPage, setHasNextPage] = useState(initialJobs.length === 10)
  const router = useRouter()

  useEffect(() => {
    fetchJobs(initialPage)
  }, [category, initialPage])

  const fetchJobs = async (pageNum: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/jobs/category/${encodeURIComponent(category)}?page=${pageNum}&limit=10`)
      const data = await response.json()

      if (data.error) {
        setError(data.error)
      } else {
        setJobs(data.jobs || [])
        setHasNextPage((data.jobs || []).length === 10)
        setCurrentPage(pageNum)
      }
    } catch (err) {
      setError("Failed to load jobs")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const truncateText = (text: string, maxLength = 150): string => {
    if (!text || text.length <= maxLength) return text || ""
    return text.substring(0, maxLength).trim() + "..."
  }

  const stripHtml = (html: string): string => {
    if (!html) return ""
    try {
      return html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .trim()
    } catch (err) {
      console.error("Error stripping HTML:", err)
      return html || ""
    }
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading {category} jobs...</div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">Error: {error}</div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            {" > "}
            <Link href="/industries" className="hover:text-blue-600">
              Industries
            </Link>
            {" > "}
            <span className="text-gray-900">{category}</span>
          </nav>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{category} Jobs</h1>
            <div className="text-muted-foreground">
              <span className="font-medium">{jobs.length}</span> jobs on this page
              {currentPage > 1 && <span className="ml-2">(Page {currentPage})</span>}
            </div>
          </div>
          <p className="text-gray-600">Explore job opportunities in the {category.toLowerCase()} industry.</p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No jobs found in {category}.</p>
            <Link href="/industries" className="text-blue-600 hover:underline mt-2 inline-block">
              Browse other industries
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          <h3 className="text-xl font-semibold mb-2">
                            <Link 
                               href={`/jobs/${job.guid}`} 
                                 className="text-blue-600 hover:text-blue-800 hover:underline"
                                  >
                                  {job.title}
                              </Link>
                          </h3>
                        </CardTitle>
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.employer}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location_raw || job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(job.post_date)}
                          </div>
                        </div>
                      </div>
                      {(job.salary_display || job.salary) && (
                        <div className="flex items-center gap-1 text-green-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {job.salary_display || job.salary}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {job.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {truncateText(stripHtml(job.description))}
                      </p>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      {job.contract_type && <Badge variant="secondary">{job.contract_type}</Badge>}
                      {job.contract_time && <Badge variant="outline">{job.contract_time}</Badge>}
                      <Badge variant="default">{job.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-center space-x-4 mt-12">
              <Button
                variant="outline"
                size="sm"
                asChild
                disabled={currentPage <= 1}
                className={currentPage <= 1 ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Link
                  href={currentPage <= 1 ? "#" : `/industries/${categoryToSlug(category)}?page=${currentPage - 1}`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Link>
              </Button>

              <span className="text-muted-foreground">Page {currentPage}</span>

              <Button
                variant="outline"
                size="sm"
                asChild
                disabled={!hasNextPage}
                className={!hasNextPage ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Link href={!hasNextPage ? "#" : `/industries/${categoryToSlug(category)}?page=${currentPage + 1}`}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
