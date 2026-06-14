import SearchClientPage from "../../SearchClientPage"
import type { Metadata } from "next"

export const revalidate = 3600
import { fromUrlSlug, toUrlSlug, toTitleCase } from "@/lib/url-utils"
import { searchJobs, getLocationAggregates } from "@/lib/supabase"
import Breadcrumbs from "@/components/layout/Breadcrumbs"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import LocationDestinationHeader from "@/components/destination/LocationDestinationHeader"

interface CitySearchPageProps {
  params: {
    city: string
  }
  searchParams: {
    page?: string
  }
}

export async function generateMetadata({ params }: CitySearchPageProps): Promise<Metadata> {
  const city = toTitleCase(fromUrlSlug(params.city))

  const { jobs } = await searchJobs("", 1, 1, city)
  const hasJobs = jobs.length > 0

  const title = `Jobs in ${city}`
  const description = `Find jobs in ${city}. Browse current openings and apply today.`

  return {
    title,
    description,
    ...(hasJobs ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical: `https://jobs.adcertifiednow.com/search/city/${toUrlSlug(city)}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://jobs.adcertifiednow.com/search/city/${toUrlSlug(city)}`,
      siteName: "AdCertified Now Jobs",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  }
}

export default async function CitySearchPage({ params, searchParams }: CitySearchPageProps) {
  const city = toTitleCase(fromUrlSlug(params.city))
  const page = Number.parseInt(searchParams.page || "1", 10)
  const limit = 10

  const [{ jobs: initialJobs, hasNextPage }, aggregates] = await Promise.all([
    searchJobs("", page, limit, city),
    getLocationAggregates(city),
  ])

  const pageUrl = `https://jobs.adcertifiednow.com/search/city/${toUrlSlug(city)}`
  const description = `Find ${aggregates.totalCount.toLocaleString("en-US")} jobs in ${city}. Top employers, salary data, and live openings.`

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Jobs in ${city}`,
    url: pageUrl,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    about: { "@type": "City", name: city },
    mainEntity: {
      "@type": "ItemList",
      name: `Jobs in ${city}`,
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
        name: `Jobs in ${city}`,
        item: `https://jobs.adcertifiednow.com/search/city/${toUrlSlug(city)}`,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <LocationDestinationHeader city={city} aggregates={aggregates} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Search", href: "/search" },
          { name: `Jobs in ${city}` },
        ]}
        className="max-w-7xl mx-auto px-4 pt-4"
      />
      <SearchClientPage
        searchParams={{ city, ...searchParams }}
        initialJobs={initialJobs}
        initialHasNextPage={hasNextPage}
        hideHero
      />
      <Footer />
    </div>
  )
}
