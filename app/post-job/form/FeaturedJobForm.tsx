"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function FeaturedJobForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    employer: "",
    location: "",
    salary: "",
    contract_type: "full-time",
    application_url: "",
    redirect_url: "",
    featured_highlights: "",
    email: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          posting_type: "featured",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to post job")
      }

      router.push("/post-job/success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div>
            <label htmlFor="employer" className="block text-sm font-medium mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="employer"
              name="employer"
              value={formData.employer}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Your company name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Your Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              We'll send your invoice and job posting confirmation to this email
            </p>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="e.g., New York, NY"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium mb-2">
                Salary (Optional)
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>

            <div>
              <label htmlFor="contract_type" className="block text-sm font-medium mb-2">
                Job Type *
              </label>
              <select
                id="contract_type"
                name="contract_type"
                value={formData.contract_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-sans"
              placeholder="Describe the role, responsibilities, and requirements..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include key responsibilities, requirements, and any benefits
            </p>
          </div>

          <div>
            <label htmlFor="featured_highlights" className="block text-sm font-medium mb-2">
              Featured Highlights (Optional)
            </label>
            <textarea
              id="featured_highlights"
              name="featured_highlights"
              value={formData.featured_highlights}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-sans"
              placeholder="Add 2-3 key points to highlight in featured placement..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              These will be prominently displayed in featured sections
            </p>
          </div>

          <div>
            <label htmlFor="application_url" className="block text-sm font-medium mb-2">
              Application URL *
            </label>
            <input
              type="url"
              id="application_url"
              name="application_url"
              value={formData.application_url}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://your-company.com/careers/job-id"
            />
            <p className="text-xs text-muted-foreground mt-1">Candidates will be redirected here to apply</p>
          </div>

          <div>
            <label htmlFor="redirect_url" className="block text-sm font-medium mb-2">
              Redirect URL (Optional)
            </label>
            <input
              type="url"
              id="redirect_url"
              name="redirect_url"
              value={formData.redirect_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://your-domain.com/redirect?job=..."
            />
            <p className="text-xs text-muted-foreground mt-1">Optional: Clicks will go through this URL first, then redirect to the application URL above</p>
          </div>

          <div className="flex items-start space-x-2 pt-4">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              required
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{" "}
              <a href="/terms" className="text-purple-600 hover:underline" target="_blank" rel="noreferrer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-purple-600 hover:underline" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full" size="lg" variant="default">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Continue to Payment"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
