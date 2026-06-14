import SearchClientPage from "../../SearchClientPage"
import type { Metadata } from "next"
import { searchJobs } from "@/lib/supabase"
import Breadcrumbs from "@/components/layout/Breadcrumbs"

interface QuerySearchPageProps {
  params: {
    query: string
  }
  searchParams: {
    page?: string
    city?: string
    state?: string
  }
}

export async function generateMetadata({ params, searchParams }: QuerySearchPageProps): Promise<Metadata> {
  const query = decodeURIComponent(params.query)
  const city = searchParams.city && searchParams.city !== "all" ? searchParams.city : undefined
  const state = searchParams.state && searchParams.state !== "all" ? searchParams.state : undefined

  const { jobs } = await searchJobs(query, 1, 1, city, state)
  const hasJobs = jobs.length > 0

  let title = `${query} Jobs`
  let description = `Find ${query} jobs across the United States. Browse current openings and apply today.`

  if (city) {
    title = `${query} Jobs in ${city}`
    description = `Find ${query} jobs in ${city}. Browse current openings and apply today.`
  }

  if (state) {
    title = `${query} Jobs in ${state}`
    description = `Find ${query} jobs in ${state}. Browse current openings and apply today.`
  }

  return {
    title,
    description,
...(hasJobs ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical: `https://jobs.adcertifiednow.com/search/q/${encodeURIComponent(query)}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://jobs.adcertifiednow.com/search/q/${encodeURIComponent(query)}`,
      siteName: "AdCertified Now Jobs",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function QuerySearchPage({ params, searchParams }: QuerySearchPageProps) {
  const query = decodeURIComponent(params.query)
  const page = Number.parseInt(searchParams.page || "1", 10)
  const city = searchParams.city && searchParams.city !== "all" ? searchParams.city : undefined
  const state = searchParams.state && searchParams.state !== "all" ? searchParams.state : undefined
  const limit = 10

  const { jobs: initialJobs, hasNextPage } = await searchJobs(query, page, limit, city, state)

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: `${query} Jobs - Search Results`,
    url: `https://jobs.adcertifiednow.com/search/q/${encodeURIComponent(query)}`,
    description: `Search results for ${query} jobs - Find your perfect job match.`,
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://jobs.adcertifiednow.com/search/q/{search_term_string}",
      },
      "query-input": "required name=search_term_string",
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
        item: "https://jobs.adcertifiednow.com/search",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${query} Jobs`,
        item: `https://jobs.adcertifiednow.com/search/q/${encodeURIComponent(query)}`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search" },
          { name: `${query} Jobs` },
        ]}
        className="max-w-7xl mx-auto px-4 pt-4"
      />
      <SearchClientPage
        searchParams={{ q: query, ...searchParams }}
        initialJobs={initialJobs}
        initialHasNextPage={hasNextPage}
      />
    </>
  )
}
