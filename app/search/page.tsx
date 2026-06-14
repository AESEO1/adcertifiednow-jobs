import SearchClientPage from "./SearchClientPage"
import { searchJobs } from "@/lib/supabase"
import type { Metadata } from "next"

export const revalidate = false

interface SearchPageProps {
  searchParams: {
    q?: string
    page?: string
    city?: string
    state?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || ""
  const city = searchParams.city || ""
  const state = searchParams.state || ""

  let title = "Search Jobs"
  let description = "Search thousands of job opportunities across the United States."

  if (query) {
    title = `${query} Jobs`
    description = `Find ${query} jobs across the United States. Browse current openings and apply today.`
  }

  if (city && city !== "all") {
    title = query ? `${query} Jobs in ${city}` : `Jobs in ${city}`
    description = query
      ? `Find ${query} jobs in ${city}. Browse current openings and apply today.`
      : `Find jobs in ${city}. Browse current openings and apply today.`
  }

  if (state && state !== "all") {
    title = query ? `${query} Jobs in ${state}` : `Jobs in ${state}`
    description = query
      ? `Find ${query} jobs in ${state}. Browse current openings and apply today.`
      : `Find jobs in ${state}. Browse current openings and apply today.`
  }

  // Canonical always points at the bare /search hub. Query/city/state variants
  // are noindex'd; if they need an indexable home, route the user to the
  // dedicated /search/q/{query}, /search/city/{city}, or /search/state/{state}
  // hubs which are their own canonicals.
  const canonical = "https://jobs.adcertifiednow.com/search"

  return {
    title,
    description,
    keywords: `${query} jobs, ${city} jobs, ${state} jobs, job search, careers, employment`,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      siteName: "AdCertified Now Jobs",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: !query && !city && !state,
      follow: true,
    },
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { jobs: initialJobs, hasNextPage: initialHasNextPage } = await searchJobs(
    searchParams.q || "",
    Number(searchParams.page) || 1,
    20,
    searchParams.city,
    searchParams.state,
  )
  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: searchParams.q ? `${searchParams.q} Jobs - Search Results` : "Job Search Results",
    url: generateCanonicalUrl("/search", searchParams),
    description: searchParams.q
      ? `Search results for ${searchParams.q} jobs - Find your perfect job match.`
      : "Search thousands of job opportunities across the United States.",
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://jobs.adcertifiednow.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Job Search Results",
      description: "List of job opportunities matching search criteria",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://jobs.adcertifiednow.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Search",
        item: generateCanonicalUrl("/search", searchParams),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SearchClientPage searchParams={searchParams} initialJobs={initialJobs} initialHasNextPage={initialHasNextPage} />
    </>
  )
}

function generateCanonicalUrl(path: string, params: Record<string, string | undefined>): string {
  const url = new URL(path, "https://jobs.adcertifiednow.com")
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "all") {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}
