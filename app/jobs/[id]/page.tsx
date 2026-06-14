import { notFound } from "next/navigation"
import { getJobById, stripHtml } from "@/lib/supabase"

export const revalidate = 86400 // cache job pages for 24h; content doesn't change after posting
import JobClientPage from "./JobClientPage"
import { formatJobDescriptionHTML } from "@/lib/format-job-description"
import { generateBreadcrumbSchema, generateJobKeywords, optimizeTitle } from "@/lib/seo-utils"
import { extractSalaryInfo } from "@/lib/structured-data"
import { categoryToSlug } from "@/lib/category-slug"
import Breadcrumbs from "@/components/layout/Breadcrumbs"
import type { JobPageProps } from "@/types"
import type { Metadata } from "next"

function getEmploymentType(contractTime: string | null | undefined, contractType: string | null | undefined): string {
  const check = (s: string | null | undefined, term: string) => s?.toLowerCase().includes(term) ?? false

  if (check(contractTime, "full") || check(contractType, "permanent")) return "FULL_TIME"
  if (check(contractTime, "part")) return "PART_TIME"
  if (check(contractTime, "contract") || check(contractType, "contract")) return "CONTRACTOR"
  if (check(contractTime, "temporary") || check(contractTime, "temp") || check(contractType, "temporary") || check(contractType, "temp")) return "TEMPORARY"
  if (check(contractTime, "intern") || check(contractType, "intern")) return "INTERN"
  if (check(contractTime, "volunteer") || check(contractType, "volunteer")) return "VOLUNTEER"
  if (check(contractTime, "per diem") || check(contractTime, "per_diem") || check(contractTime, "perdiem")) return "PER_DIEM"
  if (contractTime || contractType) return "OTHER"
  return "FULL_TIME"
}

function isRemoteJob(job: { title?: string; location?: string; location_raw?: string; contract_type?: string; contract_time?: string }): boolean {
  const fields = [job.title, job.location, job.location_raw, job.contract_type, job.contract_time]
  return fields.some(f => /remote|work from home|wfh/i.test(f || ""))
}

function extractGuidFromSlug(slug: string): string {
  if (/^[0-9a-f\-]{36}$/i.test(slug)) {
    return slug
  }
  const parts = slug.split("-")
  return parts[parts.length - 1]
}

const fetchJob = async (guid: string) => {
  return getJobById(guid)
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { id } = await params
  const guid = extractGuidFromSlug(id)
  const job = await fetchJob(guid)

  if (!job) {
    return {
      title: "Job Not Found",
      robots: { index: false, follow: false },
    }
  }

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://jobs.adcertifiednow.com").replace(/\/$/, "")
  const jobUrl = `${baseUrl}/jobs/${id}`

  const rawTitle = `${job.title}${job.employer ? ` at ${job.employer}` : ""}${job.location ? ` in ${job.location}` : ""}`
  const title = optimizeTitle(rawTitle, 60)
  const description = job.description
    ? stripHtml(job.description).slice(0, 160).trim()
    : `${job.title} position${job.employer ? ` at ${job.employer}` : ""}${job.location ? ` in ${job.location}` : ""}. Apply today on AdCertified Now Jobs.`

  // OG image is auto-generated per-job by app/jobs/[id]/opengraph-image.tsx
  return {
    title,
    description,
    keywords: generateJobKeywords(job),
    alternates: { canonical: jobUrl },
    openGraph: {
      title,
      description,
      type: "website",
      url: jobUrl,
      siteName: "AdCertified Now Jobs",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params
  const guid = extractGuidFromSlug(id)

  const job = await fetchJob(guid)

  if (!job) {
    notFound()
  }

  // Expired job → Google for Jobs expects 404/410 with noindex, not a live 200
  if (job.validThrough) {
    const expiry = new Date(job.validThrough)
    if (!Number.isNaN(expiry.getTime()) && expiry.getTime() < Date.now()) {
      notFound()
    }
  }

  const formattedDescriptionHTML = formatJobDescriptionHTML(job.description)
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://jobs.adcertifiednow.com").replace(/\/$/, "")

  const remote = isRemoteJob(job)

  const validThrough = job.validThrough || (() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split("T")[0]
  })()

  const addressLocality = job.city || job.location_parent || job.location?.split(",")[0] || ""
  const addressRegion = job.state || job.location?.split(",")[1]?.trim() || ""
  const address: Record<string, string> = {
    "@type": "PostalAddress",
    addressCountry: job.country && job.country.length <= 2 ? job.country : "US",
  }
  if (addressLocality) address.addressLocality = addressLocality
  if (addressRegion) address.addressRegion = addressRegion
  if (job.street_address) address.streetAddress = job.street_address
  if (job.zip) address.postalCode = job.zip

  const jobSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: formattedDescriptionHTML,
    identifier: {
      "@type": "PropertyValue",
      name: "AdCertified Now Jobs",
      value: job.guid.toString(),
    },
    hiringOrganization: {
      "@type": "Organization",
      name: job.employer,
    },
    jobLocation: {
      "@type": "Place",
      address,
      ...(job.geo_lat && job.geo_lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: parseFloat(job.geo_lat),
          longitude: parseFloat(job.geo_lng),
        },
      }),
    },
    ...((() => {
      // Use structured salary data if available, else try extracting from description
      if (job.salary_unit && (job.salary_min != null || job.salary_max != null)) {
        return {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: {
              "@type": "QuantitativeValue",
              ...(job.salary_min != null && job.salary_max != null && job.salary_min !== job.salary_max
                ? { minValue: job.salary_min, maxValue: job.salary_max }
                : job.salary_max != null && job.salary_min == null
                  ? { maxValue: job.salary_max }
                  : job.salary_min != null && job.salary_max == null
                    ? { minValue: job.salary_min }
                    : { value: job.salary_min }),
              unitText: job.salary_unit,
            },
          },
        }
      }
      const extracted = extractSalaryInfo(job)
      if (extracted) {
        return {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: {
              "@type": "QuantitativeValue",
              ...(extracted.min != null && extracted.max != null
                ? { minValue: extracted.min, maxValue: extracted.max }
                : { value: extracted.value }),
              unitText: extracted.period || "YEAR",
            },
          },
        }
      }
      return {}
    })()),
    employmentType: getEmploymentType(job.contract_time, job.contract_type),
    datePosted: job.post_date,
    validThrough,
    directApply: false,
    ...(remote && {
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: {
        "@type": "Country",
        name: "United States",
      },
    }),
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    ...(job.category
      ? [
          {
            name: job.category,
            url: `${baseUrl}/industries/${categoryToSlug(job.category)}`,
          },
        ]
      : []),
    { name: job.title, url: `${baseUrl}/jobs/${id}` },
  ])

  const visibleCrumbs = [
    { name: "Home", href: "/" },
    ...(job.category
      ? [{ name: job.category, href: `/industries/${categoryToSlug(job.category)}` }]
      : []),
    { name: job.title },
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Breadcrumbs items={visibleCrumbs} className="max-w-7xl mx-auto px-4 pt-4" />
      <JobClientPage params={{ id }} initialJob={job} />
    </>
  )
}
