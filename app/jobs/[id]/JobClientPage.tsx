'use client';

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Building2, Clock, ExternalLink, Briefcase, Calendar, ChevronRight } from "lucide-react"
import PageLayout from "@/components/layout/PageLayout"
import { categoryToSlug } from "@/lib/category-slug"
import { formatDate, stripHtml } from "@/lib/utils"
import { formatJobDescriptionHTML } from "@/lib/format-job-description"
import type { Job } from "@/types"
import { track } from "@vercel/analytics"
import JobSummary from "@/components/ai/JobSummary"
import SkillsBadges from "@/components/ai/SkillsBadges"
import SeniorityBadge from "@/components/ai/SeniorityBadge"
import { CVMatcherButton, CVMatcherCard } from "@/components/ai/CVMatcher"
import { isAIAvailable, promptAI } from "@/lib/ai"

interface JobClientPageProps {
  params: { id: string }
  initialJob: Job
}


export default function JobClientPage({ params, initialJob }: JobClientPageProps) {
  const { id } = params
  const job = initialJob

  const getJobTags = (job: Job) => {
    const tags = []
    if (job.contract_type) tags.push(job.contract_type)
    if (job.contract_time) tags.push(job.contract_time)
    if (job.category) tags.push(job.category)
    if (job.title?.toLowerCase().includes("remote")) tags.push("Remote")
    if (job.title?.toLowerCase().includes("senior")) tags.push("Senior Level")
    return tags
  }

  const parseLocation = (job: Job) => {
    const locationStr = job.location_raw || job.location || ""
    const parts = locationStr.split(",").map((part) => part.trim())

    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1],
        full: locationStr,
      }
    }

    return {
      city: locationStr,
      state: "",
      full: locationStr,
    }
  }

  const location = parseLocation(job)
  const applicationUrl = job.url ? `/go/${id}` : "";

  const [aiSalary, setAiSalary] = useState<string | null>(null)
  const [aiRemote, setAiRemote] = useState<string | null>(null)

  useEffect(() => {
    if (job.salary_display || !job.description) return
    let cancelled = false
    async function run() {
      const available = await isAIAvailable()
      if (!available || cancelled) return
      try {
        const result = await promptAI(
          `Find any salary, pay rate, or compensation mentioned in this text. Return it in a short format like '£30k - £40k per year' or '$25 per hour'. Return the word null if none found. Text: ${job.description!.substring(0, 2000)}`
        )
        if (cancelled) return
        if (result.trim().toLowerCase() !== 'null') setAiSalary(result.trim())
      } catch { /* silent */ }
    }
    run()
    return () => { cancelled = true }
  }, [job.description, job.salary_display])

  useEffect(() => {
    if (!job.description) return
    let cancelled = false
    async function run() {
      const available = await isAIAvailable()
      if (!available || cancelled) return
      try {
        const result = await promptAI(
          `Does this job allow remote work? Reply with exactly one word: Remote, Hybrid, or On-site. Description: ${job.description!.substring(0, 2000)}`
        )
        if (cancelled) return
        const word = result.trim().split(/\s/)[0]
        if (['Remote', 'Hybrid', 'On-site'].includes(word)) setAiRemote(word)
      } catch { /* silent */ }
    }
    run()
    return () => { cancelled = true }
  }, [job.description])

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "12px 16px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#4b5563" }}>
            <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
              Home
            </Link>
            <ChevronRight style={{ width: "16px", height: "16px" }} />
            <Link href="/search" style={{ color: "inherit", textDecoration: "none" }}>
              Jobs
            </Link>
            {job.category && (
              <>
                <ChevronRight style={{ width: "16px", height: "16px" }} />
                <Link
                  href={`/industries/${categoryToSlug(job.category)}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {job.category}
                </Link>
              </>
            )}
            <ChevronRight style={{ width: "16px", height: "16px" }} />
            <span
              style={{
                color: "#111827",
                fontWeight: "500",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {job.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
            {/* Main Content - 70% */}
            <div className="col-span-1 lg:col-span-7" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ flex: 1 }}>
                      <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                        {job.title}
                      </h1>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          color: "#4b5563",
                          marginBottom: "24px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Building2 style={{ width: "16px", height: "16px" }} />
                          <span style={{ fontWeight: "500", fontSize: "18px" }}>{job.employer}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin style={{ width: "16px", height: "16px" }} />
                          <span>{location.full}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock style={{ width: "16px", height: "16px" }} />
                          <span>
                            Posted <time dateTime={job.post_date}>{formatDate(job.post_date)}</time>
                          </span>
                        </div>
                        {(job.salary_display || aiSalary) && (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <span style={{ fontWeight: "500" }}>💰</span>
                            <span>{job.salary_display ?? `~${aiSalary}`}</span>
                          </div>
                        )}
                      </div>

                      {/* Job tags */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                        {getJobTags(job).map((tag) => (
                          <Badge key={tag} variant="outline" style={{ fontSize: "14px" }}>
                            {tag}
                          </Badge>
                        ))}

                      </div>
                      {job.description && <SkillsBadges description={job.description} />}
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Apply Button */}
              <Card>
                <CardContent style={{ paddingTop: "24px" }}>
                  {applicationUrl ? (
                    <Button
                      asChild
                      size="lg"
                      style={{ width: "100%", backgroundColor: "#2563eb", borderColor: "#2563eb", color: "white" }}
                    >
                      <a href={applicationUrl} onClick={() => track("apply_click", { job_id: id, job_title: job.title, employer: job.employer, cpc: job.cpc ?? null, feedid: job.feedid ?? null })}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <span>Apply Now</span>
                          <ExternalLink style={{ width: "16px", height: "16px" }} />
                        </span>
                      </a>
                    </Button>
                  ) : (
                    <Button
                      style={{ width: "100%", backgroundColor: "#d1d5db", cursor: "not-allowed" }}
                      size="lg"
                      disabled
                    >
                      Application Link Not Available
                    </Button>
                  )}
                </CardContent>
              </Card>

              {job.description && <JobSummary description={job.description} />}
              {job.description && <CVMatcherButton />}

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <h2 style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px", fontWeight: "bold", color: "#111827", margin: 0 }}>
                    <Briefcase style={{ width: "20px", height: "20px" }} />
                    <span>Job Description</span>
                  </h2>
                </CardHeader>
                <CardContent>
                  <div
                    style={{ color: "#374151", lineHeight: "1.625", fontSize: "16px" }}
                    dangerouslySetInnerHTML={{ __html: formatJobDescriptionHTML(stripHtml(job.description)) }}
                  />
                </CardContent>
              </Card>

              {/* Bottom Apply */}
              <Card>
                <CardContent style={{ paddingTop: "24px" }}>
                  <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#111827", marginBottom: "16px" }}>
                    Apply for {job.title} job
                  </h2>
                  {applicationUrl ? (
                    <Button
                      asChild
                      size="lg"
                      style={{ width: "100%", backgroundColor: "#2563eb", borderColor: "#2563eb", color: "white" }}
                    >
                      <a href={applicationUrl} onClick={() => track("apply_click", { job_id: id, job_title: job.title, employer: job.employer, cpc: job.cpc ?? null, feedid: job.feedid ?? null })}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <span>Apply Now</span>
                          <ExternalLink style={{ width: "16px", height: "16px" }} />
                        </span>
                      </a>
                    </Button>
                  ) : (
                    <Button
                      style={{ width: "100%", backgroundColor: "#d1d5db", cursor: "not-allowed" }}
                      size="lg"
                      disabled
                    >
                      Application Link Not Available
                    </Button>
                  )}
                </CardContent>
              </Card>
              {job.description && (
                <CVMatcherCard jobDescription={job.description} jobTitle={job.title || 'this job'} />
              )}
            </div>

            {/* Sidebar - 30% */}
            <aside
              className="col-span-1 lg:col-span-3"
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Job Summary */}
              <Card>
                <CardHeader>
                  <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#111827", margin: 0 }}>Job Summary</h2>
                </CardHeader>
                <CardContent style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <dl style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {job.contract_type && (
                      <>
                        <dt style={{ color: "#6b7280", fontWeight: "500" }}>Employment Type</dt>
                        <dd style={{ fontWeight: "600", margin: 0 }}>
                          {job.contract_type
                            .replace(/_/g, " ")
                            .replace(/-/g, " ")
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(" ")}
                        </dd>
                      </>
                    )}
                    {job.category && (
                      <>
                        <dt style={{ color: "#6b7280", fontWeight: "500" }}>Category</dt>
                        <dd style={{ fontWeight: "600", margin: 0 }}>
                          <Link href={`/industries/${categoryToSlug(job.category)}`} style={{ color: "#2563eb", textDecoration: "none" }}>
                            {job.category}
                          </Link>
                        </dd>
                      </>
                    )}
                    {job.description && (
                      <SeniorityBadge title={job.title || ''} description={job.description} />
                    )}
                    <>
                      <dt style={{ color: "#6b7280", fontWeight: "500" }}>Location</dt>
                      <dd style={{ fontWeight: "600", margin: 0 }}>{location.full}</dd>
                    </>
                    <>
                      <dt style={{ color: "#6b7280", fontWeight: "500" }}>Remote Work</dt>
                      <dd style={{ fontWeight: "600", margin: 0 }}>
                        {aiRemote ?? (job.title?.toLowerCase().includes("remote") ? "Remote" : "On-site")}
                      </dd>
                    </>
                    {(job.salary_display || aiSalary) && (
                      <>
                        <dt style={{ color: "#6b7280", fontWeight: "500" }}>Salary</dt>
                        <dd style={{ fontWeight: "600", margin: 0 }}>{job.salary_display ?? `~${aiSalary}`}</dd>
                      </>
                    )}
                    <Separator />
                    <>
                      <dt style={{ color: "#6b7280", fontWeight: "500" }}>Posted</dt>
                      <dd style={{ fontWeight: "600", margin: 0 }}>{formatDate(job.post_date)}</dd>
                    </>

                  </dl>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
