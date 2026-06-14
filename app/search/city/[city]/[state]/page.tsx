import SearchClientPage from "../../../SearchClientPage"
import type { Metadata } from "next"

export const revalidate = 3600
import { fromUrlSlug, toUrlSlug, toTitleCase } from "@/lib/url-utils"
import { searchJobs, getLocationAggregates } from "@/lib/supabase"
import Breadcrumbs from "@/components/layout/Breadcrumbs"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import LocationDestinationHeader from "@/components/destination/LocationDestinationHeader"

interface CityStateSearchPageProps {
  params: {
    city: string
    state: string
  }
  searchParams: {
    page?: string
    q?: string
  }
}

export async function generateMetadata({ params, searchParams }: CityStateSearchPageProps): Promise<Metadata> {
  const city = toTitleCase(fromUrlSlug(params.city))
  const state = toTitleCase(fromUrlSlug(params.state))
  const query = searchParams.q

  const { jobs } = await searchJobs(query || "", 1, 1, city, state)
  const hasJobs = jobs.length > 0

  let title = `Jobs in ${city}, ${state}`
  let description = `Find jobs in ${city}, ${state}. Browse current openings and apply today.`

  if (query) {
    title = `${query} Jobs in ${city}, ${state}`
    description = `Find ${query} jobs in ${city}, ${state}. Browse current openings and apply today.`
  }

  return {
    title,
    description,
    ...(hasJobs ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical: `https://jobs.adcertifiednow.com/search/city/${toUrlSlug(city)}/${toUrlSlug(state)}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://jobs.adcertifiednow.com/search/city/${toUrlSlug(city)}/${toUrlSlug(state)}`,
      siteName: "AdCertified Now Jobs",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function CityStateSearchPage({ params, searchParams }: CityStateSearchPageProps) {
  const city = toTitleCase(fromUrlSlug(params.city))
  const state = toTitleCase(fromUrlSlug(params.state))
  const page = Number.parseInt(searchParams.page || "1", 10)
  const query = searchParams.q
  const limit = 10

  const [{ jobs: initialJobs, hasNextPage }, aggregates] = await Promise.all([
    searchJobs(query || "", page, limit, city, state),
    getLocationAggregates(city, state),
  ])

  const pageUrl = `https://jobs.adcertifiednow.com/search/city/${toUrlSlug(city)}/${toUrlSlug(state)}`
  const description = `Find ${aggregates.totalCount.toLocaleString("en-US")} jobs in ${city}, ${state}. Top employers, salary data, and live openings.`

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Jobs in ${city}, ${state}`,
    url: pageUrl,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    about: {
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: state,
        containedInPlace: { "@type": "Country", name: "United States" },
      },
    },
    mainEntity: {
      "@type": "ItemList",
      name: `Jobs in ${city}, ${state}`,
      numberOfItems: aggregates.totalCount,
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
        name: `Jobs in ${city}, ${state}`,
        item: `https://jobs.adcertifiednow.com/search/city/${toUrlSlug(city)}/${toUrlSlug(state)}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <LocationDestinationHeader city={city} state={state} aggregates={aggregates} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search" },
          { name: `Jobs in ${city}, ${state}` },
        ]}
        className="max-w-7xl mx-auto px-4 pt-4"
      />
      <SearchClientPage
        searchParams={{ city, state, ...searchParams }}
        initialJobs={initialJobs}
        initialHasNextPage={hasNextPage}
        hideHero
      />
      <Footer />
    </div>
  )
}
