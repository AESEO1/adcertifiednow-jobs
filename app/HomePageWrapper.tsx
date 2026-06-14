import { Suspense } from "react"
import Link from "next/link"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import JobListingsClient from "./JobListingsClient"
import HeroSearchForm from "./HeroSearchForm"
import { getJobs, getCategories, getTopCityStates } from "@/lib/supabase"
import { categoryToSlug } from "@/lib/category-slug"
import { toUrlSlug } from "@/lib/url-utils"
import { US_STATES } from "@/lib/us-states"

export default async function HomePageWrapper() {
  const [{ jobs: initialJobs, hasNextPage: initialHasNextPage }, { data: categories }, topCityStates] = await Promise.all([
    getJobs(1, 20),
    getCategories(),
    getTopCityStates(24),
  ])

  const topIndustries = (categories || []).slice().sort((a, b) => a.localeCompare(b)).slice(0, 18)
  const topStates = US_STATES.map((s) => s.name)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-blue-700 bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 !text-white drop-shadow-lg">Find Your Dream Job Today</h1>
          <p className="text-xl md:text-2xl mb-8 !text-white drop-shadow-md">
            Discover thousands of opportunities across the United States
          </p>
          <div className="max-w-2xl mx-auto">
            <HeroSearchForm />
          </div>
        </div>
      </section>

      {/* Server-rendered Latest Jobs links — crawlable surface */}
      {initialJobs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-10" aria-labelledby="latest-jobs-heading">
          <h2 id="latest-jobs-heading" className="text-2xl font-bold mb-4 text-gray-900">Latest Jobs</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {initialJobs.slice(0, 12).map((job) => (
              <li key={`seed-${job.guid}`} className="truncate">
                <Link href={`/jobs/${job.guid}`} className="text-blue-700 hover:underline">
                  {job.title}
                  {job.location ? ` — ${job.location}` : ""}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Browse by Industry — server-rendered link grid */}
      {topIndustries.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-10" aria-labelledby="industries-heading">
          <div className="flex items-baseline justify-between mb-4">
            <h2 id="industries-heading" className="text-2xl font-bold text-gray-900">Browse Jobs by Industry</h2>
            <Link href="/industries" className="text-blue-700 hover:underline text-sm">View all →</Link>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
            {topIndustries.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/industries/${categoryToSlug(cat)}`}
                  className="text-blue-700 hover:underline"
                >
                  {cat} Jobs
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Browse by State — server-rendered link grid */}
      {topStates.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-10" aria-labelledby="states-heading">
          <h2 id="states-heading" className="text-2xl font-bold mb-4 text-gray-900">Browse Jobs by State</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-2 text-sm">
            {topStates.map((state) => (
              <li key={state}>
                <Link
                  href={`/search/state/${toUrlSlug(state)}`}
                  className="text-blue-700 hover:underline"
                >
                  Jobs in {state}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Browse by City — top city+state pairs, server-rendered */}
      {topCityStates.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-10" aria-labelledby="cities-heading">
          <h2 id="cities-heading" className="text-2xl font-bold mb-4 text-gray-900">Browse Jobs by City</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
            {topCityStates.map(({ city, state }) => (
              <li key={`${city}-${state}`}>
                <Link
                  href={`/search/city/${toUrlSlug(city)}/${toUrlSlug(state)}`}
                  className="text-blue-700 hover:underline"
                >
                  Jobs in {city}, {state}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Interactive paginated listings (client) */}
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">Loading jobs...</div>}>
        <JobListingsClient initialJobs={initialJobs} initialHasNextPage={initialHasNextPage} />
      </Suspense>

      <Footer />
    </div>
  )
}
