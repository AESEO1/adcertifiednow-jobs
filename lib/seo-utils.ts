import type { Metadata } from "next"

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  noindex?: boolean
  ogImage?: string
  ogType?: "website" | "article" | "profile"
  twitterCard?: "summary" | "summary_large_image"
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
}

export function generateSEOMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords,
    canonical,
    noindex = false,
    ogImage,
    ogType = "website",
    twitterCard = "summary_large_image",
    publishedTime,
    modifiedTime,
    author,
    section,
  } = config

  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonical,
      siteName: "AdCertified Now Jobs",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: title }] : undefined,
      publishedTime,
      modifiedTime,
      section,
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
      creator: "@todaysjobs",
    },
  }

  return metadata
}

export function optimizeTitle(title: string, maxLength = 60): string {
  if (title.length <= maxLength) return title

  const words = title.split(" ")
  let optimized = ""

  for (const word of words) {
    if ((optimized + " " + word).length > maxLength - 3) break
    optimized += (optimized ? " " : "") + word
  }

  return optimized + "..."
}

export function optimizeDescription(description: string, maxLength = 160): string {
  if (description.length <= maxLength) return description

  const truncated = description.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(" ")

  return (lastSpace > maxLength * 0.8 ? truncated.substring(0, lastSpace) : truncated) + "..."
}

export function generateJobKeywords(job: any): string {
  const keywords = []

  if (job.title) keywords.push(job.title.toLowerCase())
  if (job.employer) keywords.push(job.employer.toLowerCase())
  if (job.city) keywords.push(`${job.city.toLowerCase()} jobs`)
  if (job.state) keywords.push(`${job.state.toLowerCase()} jobs`)
  if (job.contract_type) keywords.push(job.contract_type.toLowerCase())

  // Add industry-specific keywords
  const title = job.title?.toLowerCase() || ""
  if (title.includes("nurse")) keywords.push("nursing jobs", "healthcare jobs")
  if (title.includes("engineer")) keywords.push("engineering jobs", "tech jobs")
  if (title.includes("manager")) keywords.push("management jobs", "leadership roles")
  if (title.includes("remote")) keywords.push("remote work", "work from home")

  keywords.push("careers", "employment", "job opportunities")

  return [...new Set(keywords)].join(", ")
}

export function generateCanonicalUrl(path: string, params?: Record<string, string>): string {
  const baseUrl = "https://jobs.adcertifiednow.com"
  const url = new URL(path, baseUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        url.searchParams.set(key, value)
      }
    })
  }

  return url.toString()
}

export function extractSalaryFromDescription(description: string): number | null {
  if (!description) return null

  const salaryPatterns = [
    /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:per\s+year|annually|\/year)/i,
    /\$(\d{1,3}(?:,\d{3})*)\s*-\s*\$(\d{1,3}(?:,\d{3})*)\s*(?:per\s+year|annually|\/year)/i,
    /(\d{1,3}(?:,\d{3})*)\s*k\s*(?:per\s+year|annually|\/year)/i,
  ]

  for (const pattern of salaryPatterns) {
    const match = description.match(pattern)
    if (match) {
      const salary = match[1].replace(/,/g, "")
      return Number.parseInt(salary, 10)
    }
  }

  return null
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateOrganizationSchema(company: any): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    address: company.address
      ? {
          "@type": "PostalAddress",
          addressLocality: company.address.city,
          addressRegion: company.address.state,
          postalCode: company.address.zip,
          addressCountry: company.address.country || "US",
        }
      : undefined,
    url: company.website,
    sameAs: company.socialMedia || undefined,
  }
}
