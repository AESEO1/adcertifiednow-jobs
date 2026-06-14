import { stripHtml } from "./supabase"

export interface JobListingSchemaProps {
  jobs: any[]
  currentPage?: number
  totalJobs?: number
  searchQuery?: string
  location?: string
}

export function generateJobListingSchema({
  jobs,
  currentPage = 1,
  totalJobs,
  searchQuery,
  location,
}: JobListingSchemaProps) {
  // ItemList schema for job listings
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: searchQuery ? `${searchQuery} Jobs` : "Job Listings",
    description: searchQuery
      ? `Find ${searchQuery} jobs${location ? ` in ${location}` : ""} - Browse current openings and apply today.`
      : "Browse thousands of job opportunities across the United States.",
    url: searchQuery
      ? `https://jobs.adcertifiednow.com/search?q=${encodeURIComponent(searchQuery)}${location ? `&location=${encodeURIComponent(location)}` : ""}`
      : "https://jobs.adcertifiednow.com",
    numberOfItems: totalJobs || jobs.length,
    itemListElement: jobs.slice(0, 20).map((job, index) => {
      const companyName = job.employer || "Company"
      const city = job.location || ""
      const state = job.location_parent || ""
      const country = job.country || "US"

      return {
        "@type": "ListItem",
        position: (currentPage - 1) * 20 + index + 1,
        item: {
          "@type": "JobPosting",
          "@id": `https://jobs.adcertifiednow.com/jobs/${job.guid}`,
          title: job.title,
          description: stripHtml(job.description).substring(0, 200),
          identifier: {
            "@type": "PropertyValue",
            name: companyName,
            value: job.guid,
          },
          datePosted: job.post_date || job.created_at,
          validThrough: job.validThrough,
          employmentType: getEmploymentType(job.contract_time),
          hiringOrganization: {
            "@type": "Organization",
            name: companyName,
            address: {
              "@type": "PostalAddress",
              addressLocality: city,
              addressRegion: state,
              addressCountry: country,
            },
          },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: city,
              addressRegion: state,
              addressCountry: country,
            },
            ...(job.geo_lat &&
              job.geo_lng && {
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: job.geo_lat,
                  longitude: job.geo_lng,
                },
              }),
          },
          url: `https://jobs.adcertifiednow.com/jobs/${job.guid}`,
          industry: getIndustryFromJob(job),
          occupationalCategory: getJobCategory(job),
          jobLocationType: job.title?.toLowerCase().includes("remote") ? "TELECOMMUTE" : undefined,
          applicantLocationRequirements: {
            "@type": "Country",
            name: "USA",
          },
        },
      }
    }),
  }

  return itemListSchema
}

export function generateCollectionPageSchema(pageType: "homepage" | "search", searchQuery?: string, location?: string) {
  const baseUrl = "https://jobs.adcertifiednow.com"
  const pageUrl =
    pageType === "search" ? `${baseUrl}/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}` : baseUrl

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageUrl,
    name:
      pageType === "search"
        ? `${searchQuery || "Job"} Search Results${location ? ` in ${location}` : ""}`
        : "AdCertified Now Jobs - Find Your Dream Job Today",
    description:
      pageType === "search"
        ? `Search results for ${searchQuery || "jobs"}${location ? ` in ${location}` : ""} - Find your perfect job match.`
        : "Discover thousands of job opportunities across the United States. Find your perfect job match with AdCertified Now Jobs.",
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: baseUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      name: pageType === "search" ? "Job Search Results" : "Latest Job Listings",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement:
        pageType === "search"
          ? [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: baseUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Search",
                item: pageUrl,
              },
            ]
          : [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: baseUrl,
              },
            ],
    },
  }
}

export function generateGoogleJobPostingSchema(job: any, canonicalUrl: string) {
  const companyName = job.employer || "Company"
  const city = job.location || ""
  const state = job.location_parent || ""
  const country = job.country || "US"

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: stripHtml(job.description),
    identifier: {
      "@type": "PropertyValue",
      name: companyName,
      value: job.guid,
    },
    datePosted: job.post_date || job.created_at,
    validThrough: job.validThrough || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    employmentType: getEmploymentType(job.contract_type),
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.address || "",
        addressLocality: city,
        addressRegion: state,
        postalCode: job.zip || "",
        addressCountry: country,
      },
      ...(job.geo_lat &&
        job.geo_lng && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: job.geo_lat,
            longitude: job.geo_lng,
          },
        }),
    },
    baseSalary: job.salary_unit && (job.salary_min != null || job.salary_max != null)
      ? {
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
                  : { minValue: job.salary_min, maxValue: job.salary_max }),
            unitText: job.salary_unit,
          },
        }
      : undefined,
    applicantLocationRequirements: {
      "@type": "Country",
      name: "USA",
    },
  }
}

export function generateEnhancedJobPostingSchema(job: any, canonicalUrl: string) {
  // This function is deprecated - use generateGoogleJobPostingSchema instead
  return generateGoogleJobPostingSchema(job, canonicalUrl)
}

function getEmploymentType(status: string): string {
  if (!status) return "FULL_TIME"
  const statusLower = status.toLowerCase()
  if (statusLower.includes("full")) return "FULL_TIME"
  if (statusLower.includes("part")) return "PART_TIME"
  if (statusLower.includes("contract")) return "CONTRACTOR"
  if (statusLower.includes("temporary") || statusLower.includes("temp")) return "TEMPORARY"
  if (statusLower.includes("intern")) return "INTERN"
  if (statusLower.includes("volunteer")) return "VOLUNTEER"
  if (statusLower.includes("per diem") || statusLower.includes("per_diem") || statusLower.includes("perdiem"))
    return "PER_DIEM"
  // Return OTHER for unrecognized employment types instead of defaulting to FULL_TIME
  if (statusLower.length > 0 && !statusLower.includes("full")) return "OTHER"
  return "FULL_TIME"
}

function getIndustryFromJob(job: any): string | undefined {
  const title = job.title?.toLowerCase() || ""
  const company = job.employer?.toLowerCase() || ""
  const description = stripHtml(job.description || "").toLowerCase()

  const industryKeywords = {
    Healthcare: ["nurse", "healthcare", "medical", "hospital", "clinic", "doctor", "physician"],
    Technology: ["tech", "software", "developer", "engineer", "programmer", "IT", "computer"],
    Education: ["teacher", "education", "school", "university", "academic", "instructor"],
    Finance: ["finance", "banking", "accounting", "financial", "investment", "insurance"],
    Retail: ["retail", "sales", "store", "customer service", "cashier", "merchandise"],
    Manufacturing: ["manufacturing", "production", "factory", "assembly", "quality control"],
    Transportation: ["driver", "transportation", "logistics", "delivery", "shipping", "trucking"],
    Construction: ["construction", "contractor", "builder", "electrician", "plumber", "carpenter"],
    Hospitality: ["hotel", "restaurant", "hospitality", "food service", "chef", "server"],
    Government: ["government", "federal", "state", "city", "public sector", "municipal"],
  }

  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    if (
      keywords.some((keyword) => title.includes(keyword) || company.includes(keyword) || description.includes(keyword))
    ) {
      return industry
    }
  }

  return undefined
}

function getJobCategory(job: any): string | undefined {
  const title = job.title?.toLowerCase() || ""

  const categories = {
    "Healthcare Practitioners and Technical": ["nurse", "doctor", "physician", "therapist", "technician"],
    "Computer and Mathematical": ["software", "developer", "programmer", "engineer", "analyst", "data"],
    Management: ["manager", "director", "supervisor", "lead", "chief", "head"],
    "Sales and Related": ["sales", "account", "business development", "representative"],
    "Education, Training, and Library": ["teacher", "instructor", "professor", "trainer", "librarian"],
    "Transportation and Material Moving": ["driver", "operator", "pilot", "dispatcher"],
    "Construction and Extraction": ["construction", "electrician", "plumber", "carpenter", "contractor"],
    "Food Preparation and Serving Related": ["chef", "cook", "server", "bartender", "food service"],
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => title.includes(keyword))) {
      return category
    }
  }

  return undefined
}

function getJobTags(job: any): string[] {
  const tags = []
  const title = job.title?.toLowerCase() || ""
  const description = stripHtml(job.description || "").toLowerCase()

  if (job.employmentStatus) tags.push(job.employmentStatus)
  if (job.state) tags.push(job.state)

  const skillKeywords = {
    Nursing: ["nurse", "rn", "nursing"],
    Technology: ["tech", "technologist", "technology"],
    Travel: ["travel"],
    Remote: ["remote"],
    "Senior Level": ["senior"],
    Management: ["manager", "management"],
    Engineering: ["engineer", "engineering"],
    Healthcare: ["healthcare"],
    Finance: ["finance", "financial"],
    Sales: ["sales"],
    Marketing: ["marketing"],
  }

  for (const [tag, keywords] of Object.entries(skillKeywords)) {
    if (keywords.some((keyword) => title.includes(keyword) || description.includes(keyword))) {
      tags.push(tag)
    }
  }

  return [...new Set(tags)].slice(0, 5)
}

export function extractSalaryInfo(job: any): { min?: number; max?: number; value?: number; period?: string } | null {
  const description = stripHtml(job.description || "").toLowerCase()

  // Salary patterns
  const patterns = [
    /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*-\s*\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:per\s+year|annually|\/year)/i,
    /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:per\s+year|annually|\/year)/i,
    /(\d{1,3}(?:,\d{3})*)\s*k\s*-\s*(\d{1,3}(?:,\d{3})*)\s*k\s*(?:per\s+year|annually|\/year)/i,
    /(\d{1,3}(?:,\d{3})*)\s*k\s*(?:per\s+year|annually|\/year)/i,
  ]

  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match) {
      if (match[2]) {
        // Range found
        return {
          min: Number.parseInt(match[1].replace(/,/g, ""), 10) * (match[0].includes("k") ? 1000 : 1),
          max: Number.parseInt(match[2].replace(/,/g, ""), 10) * (match[0].includes("k") ? 1000 : 1),
          period: "YEAR",
        }
      } else {
        // Single value found
        return {
          value: Number.parseInt(match[1].replace(/,/g, ""), 10) * (match[0].includes("k") ? 1000 : 1),
          period: "YEAR",
        }
      }
    }
  }

  return null
}

function extractRequirements(description: string): string[] {
  const text = stripHtml(description).toLowerCase()
  const requirements: string[] = []

  const patterns = [
    /(?:requires?|must have|needed|essential)[\s\S]*?(?:degree|bachelor|master|phd|certification|license)/gi,
    /(?:requires?|must have|needed|essential)[\s\S]*?(?:\d+\+?\s*years?\s*(?:of\s*)?experience)/gi,
    /(?:requires?|must have|needed|essential)[\s\S]*?(?:skills?|knowledge|proficiency)/gi,
  ]

  patterns.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach((match) => {
        const cleaned = match.replace(/\s+/g, " ").trim()
        if (cleaned.length > 10 && cleaned.length < 200) {
          requirements.push(cleaned)
        }
      })
    }
  })

  return [...new Set(requirements)].slice(0, 5)
}

function extractBenefits(description: string): string[] {
  const text = stripHtml(description).toLowerCase()
  const benefits: string[] = []

  const benefitKeywords = [
    "health insurance",
    "dental",
    "vision",
    "401k",
    "retirement",
    "pto",
    "paid time off",
    "vacation",
    "sick leave",
    "bonus",
    "commission",
    "flexible schedule",
    "remote work",
    "work from home",
    "professional development",
    "training",
    "tuition reimbursement",
  ]

  benefitKeywords.forEach((keyword) => {
    if (text.includes(keyword)) {
      benefits.push(keyword.charAt(0).toUpperCase() + keyword.slice(1))
    }
  })

  return [...new Set(benefits)]
}

function extractSkills(description: string): string[] {
  const text = stripHtml(description).toLowerCase()
  const skills: string[] = []

  const skillKeywords = [
    "javascript",
    "python",
    "java",
    "react",
    "node.js",
    "sql",
    "html",
    "css",
    "communication",
    "leadership",
    "teamwork",
    "problem solving",
    "analytical",
    "microsoft office",
    "excel",
    "powerpoint",
    "project management",
    "customer service",
  ]

  skillKeywords.forEach((skill) => {
    if (text.includes(skill)) {
      skills.push(skill.charAt(0).toUpperCase() + skill.slice(1))
    }
  })

  return [...new Set(skills)]
}
