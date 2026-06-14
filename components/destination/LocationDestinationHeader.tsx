import Link from "next/link"
import { categoryToSlug } from "@/lib/category-slug"
import { toUrlSlug } from "@/lib/url-utils"
import type { LocationAggregates } from "@/lib/supabase"

interface Props {
  city?: string
  state?: string
  aggregates: LocationAggregates
  topCities?: Array<{ city: string; count: number }>
}

function formatSalary(annual: number | null): string {
  if (annual == null) return ""
  if (annual >= 100_000) return `$${Math.round(annual / 1000)}k`
  return `$${annual.toLocaleString("en-US")}`
}

function locationLabel(city?: string, state?: string): string {
  if (city && state) return `${city}, ${state}`
  if (city) return city
  if (state) return state
  return "United States"
}

function copyParagraph(label: string, agg: LocationAggregates): string {
  const parts: string[] = []

  if (agg.totalCount > 0) {
    parts.push(`${agg.totalCount.toLocaleString("en-US")} jobs are currently advertised in ${label}.`)
  } else {
    parts.push(`Browse jobs available in ${label}.`)
  }

  const cats = agg.topCategories.slice(0, 3).map((c) => c.name)
  if (cats.length === 3) {
    parts.push(`The most active hiring industries are ${cats[0]}, ${cats[1]}, and ${cats[2]}.`)
  } else if (cats.length === 2) {
    parts.push(`Top hiring industries include ${cats[0]} and ${cats[1]}.`)
  } else if (cats.length === 1) {
    parts.push(`The leading hiring industry is ${cats[0]}.`)
  }

  const emps = agg.topEmployers.slice(0, 3).map((e) => e.name)
  if (emps.length >= 2) {
    parts.push(`Major employers actively hiring right now include ${emps.join(", ")}.`)
  } else if (emps.length === 1) {
    parts.push(`${emps[0]} is one of the largest employers currently hiring.`)
  }

  if (agg.avgAnnualSalary) {
    parts.push(`The average advertised salary works out to roughly ${formatSalary(agg.avgAnnualSalary)} per year.`)
  }

  parts.push(`Filter the listings below by role, salary, or contract type to find your next opportunity.`)

  return parts.join(" ")
}

export default function LocationDestinationHeader({ city, state, aggregates, topCities = [] }: Props) {
  const label = locationLabel(city, state)
  const heading = `Jobs in ${label}`
  const paragraph = copyParagraph(label, aggregates)

  const stats: Array<{ label: string; value: string }> = []
  if (aggregates.totalCount > 0) {
    stats.push({ label: "Live jobs", value: aggregates.totalCount.toLocaleString("en-US") })
  }
  if (aggregates.avgAnnualSalary) {
    stats.push({ label: "Avg salary", value: `${formatSalary(aggregates.avgAnnualSalary)} / yr` })
  }
  if (aggregates.topCategories.length > 0) {
    stats.push({ label: "Top industry", value: aggregates.topCategories[0].name })
  }
  if (aggregates.topEmployers.length > 0) {
    stats.push({ label: "Top employer", value: aggregates.topEmployers[0].name })
  }

  return (
    <>
      <section
        className="bg-blue-700 bg-gradient-to-r from-blue-600 to-purple-600 py-12 md:py-16"
        aria-labelledby="loc-heading"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1
            id="loc-heading"
            className="text-4xl md:text-6xl font-bold mb-4 !text-white drop-shadow-lg"
          >
            {heading}
          </h1>
          <p className="text-lg md:text-xl !text-white/95 drop-shadow-md max-w-4xl mx-auto leading-relaxed">
            {paragraph}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
      {stats.length > 0 && (
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-lg border p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500">{s.label}</dt>
              <dd className="text-lg font-semibold text-gray-900 truncate" title={s.value}>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {aggregates.topCategories.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Browse by industry in {label}</h2>
          <ul className="flex flex-wrap gap-2">
            {aggregates.topCategories.map((c) => (
              <li key={c.name}>
                <Link
                  href={`/industries/${categoryToSlug(c.name)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm hover:bg-blue-100"
                >
                  {c.name} <span className="ml-1.5 text-blue-500">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state && !city && topCities.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Top cities in {state}</h2>
          <ul className="flex flex-wrap gap-2">
            {topCities.map((c) => (
              <li key={c.city}>
                <Link
                  href={`/search/city/${toUrlSlug(c.city)}/${toUrlSlug(state)}`}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-gray-800 text-sm hover:bg-gray-100"
                >
                  {c.city} <span className="ml-1.5 text-gray-500">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {city && state && (
        <div className="mb-4">
          <Link
            href={`/search/state/${toUrlSlug(state)}`}
            className="inline-flex items-center text-sm text-blue-700 hover:underline"
          >
            View all jobs in {state} →
          </Link>
        </div>
      )}
      </section>
    </>
  )
}
