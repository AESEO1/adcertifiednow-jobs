import SearchClientPage from "../../SearchClientPage"
import type { Metadata } from "next"

export const revalidate = 3600
import { fromUrlSlug, toUrlSlug, toTitleCase } from "@/lib/url-utils"
import { searchJobs, getLocationAggregates, getTopCitiesInState } from "@/lib/supabase"
import Breadcrumbs from "@/components/layout/Breadcrumbs"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import LocationDestinationHeader from "@/components/destination/LocationDestinationHeader"

interface StateSearchPageProps {
  params: {
    state: string
  }
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({ params }: StateSearchPageProps): Promise<Metadata> {
  const state = toTitleCase(fromUrlSlug(params.state))

  const { jobs } = await searchJobs("", 1, 1, undefined, state)
  const hasJobs = jobs.length > 0

  const title = `Jobs in ${state}`
  const description = `Find jobs in ${state}. Browse current openings across cities and apply today.`

  return {
    title,
    description,
    ...(hasJobs ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical: `https://jobs.adcertifiednow.com/search/state/${toUrlSlug(state)}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://jobs.adcertifiednow.com/search/state/${toUrlSlug(state)}`,
      siteName: "AdCertified Now Jobs",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function StateSearchPage({ params, searchParams }: StateSearchPageProps) {
  const state = toTitleCase(fromUrlSlug(params.state))
  const page = Number.parseInt(searchParams.page || "1", 10)
  const limit = 10

  const [{ jobs: initialJobs, hasNextPage }, aggregates, topCities] = await Promise.all([
    searchJobs("", page, limit, undefined, state),
    getLocationAggregates(undefined, state),
    getTopCitiesInState(state, 12),
  ])

  const pageUrl = `https://jobs.adcertifiednow.com/search/state/${toUrlSlug(state)}`
  const description = `Find ${aggregates.totalCount.toLocaleString("en-US")} jobs in ${state}. Top employers, salary data, and live openings across the state.`

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Jobs in ${state}`,
    url: pageUrl,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    about: {
      "@type": "AdministrativeArea",
      name: state,
      containedInPlace: { "@type": "Country", name: "United States" },
    },
    mainEntity: {
      "@type": "ItemList",
      name: `Jobs in ${state}`,
      numberOfItems: aggregates.totalCount,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://jobs.adcertifiednow.com" },
      { "@type": "ListItem", position: 2, name: "Search", item: "https://jobs.adcertifiednow.com/search" },
      {
        "@type": "ListItem",
        position: 3,
        name: `Jobs in ${state}`,
        item: `https://jobs.adcertifiednow.com/search/state/${toUrlSlug(state)}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <LocationDestinationHeader state={state} aggregates={aggregates} topCities={topCities} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search" },
          { name: `Jobs in ${state}` },
        ]}
        className="max-w-7xl mx-auto px-4 pt-4"
      />
      <SearchClientPage
        searchParams={{ state, ...searchParams }}
        initialJobs={initialJobs}
        initialHasNextPage={hasNextPage}
        hideHero
      />
      <Footer />
    </div>
  )
}
