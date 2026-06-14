import { createClient } from "@supabase/supabase-js"
import { unstable_cache } from "next/cache"
import type { Job } from "@/types"

type SalaryUnit = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'

interface ParsedSalary {
  min?: number
  max?: number
  unit?: SalaryUnit
  display?: string
}

function parseSalary(raw: string | undefined): ParsedSalary | null {
  if (!raw || !raw.trim()) return null

  const s = raw.trim()

  // Garbage detection
  if (s.includes('$map.get')) return null
  if (/^n\/a$/i.test(s)) return null
  if (/^\s*-\s*(hourly|per hour)\s*$/i.test(s)) return null

  // Detect unit from text
  const lower = s.toLowerCase()
  let unit: SalaryUnit | undefined
  if (/\/hr\b|\/hour\b|per hour|hourly/.test(lower)) unit = 'HOUR'
  else if (/per week|\/week\b|weekly/.test(lower)) unit = 'WEEK'
  else if (/per year|per annum|yearly|annual|\/year\b/.test(lower)) unit = 'YEAR'
  else if (/per day|\/day\b|\bday\b/.test(lower)) unit = 'DAY'
  else if (/per month|\/month\b|monthly/.test(lower)) unit = 'MONTH'

  // Extract numbers — handle $, commas, k/K suffix
  const numStr = s.replace(/[$,]/g, '')

  let min: number | undefined
  let max: number | undefined

  // "Up to $X" → max only
  const upTo = s.match(/up\s+to\s+\$?([\d,]+(?:\.\d+)?)\s*([kK])?/i)
  if (upTo) {
    const val = parseFloat(upTo[1].replace(/,/g, ''))
    max = upTo[2] ? val * 1000 : val
  } else {
    // Range: X - Y or X–Y (with optional $ and k)
    const rangePat = /\$?([\d,]+(?:\.\d+)?)\s*([kK])?\s*[-–]\s*\$?([\d,]+(?:\.\d+)?)\s*([kK])?/
    const rangeMatch = numStr.match(rangePat)
    if (rangeMatch) {
      const a = parseFloat(rangeMatch[1].replace(/,/g, ''))
      min = rangeMatch[2] ? a * 1000 : a
      const b = parseFloat(rangeMatch[3].replace(/,/g, ''))
      max = rangeMatch[4] ? b * 1000 : b
    } else {
      // Single number (possibly with + suffix meaning "min only")
      const singlePat = /\$?([\d,]+(?:\.\d+)?)\s*([kK])?/
      const singleMatch = numStr.match(singlePat)
      if (singleMatch) {
        const val = parseFloat(singleMatch[1].replace(/,/g, ''))
        const n = singleMatch[2] ? val * 1000 : val
        if (s.includes('+')) {
          min = n
        } else {
          min = n
          max = n
        }
      }
    }
  }

  // Validate: reject zero/near-zero values
  const primary = min ?? max
  if (primary === undefined || primary <= 1) return null
  if (min === 0 && max === 0) return null
  if (min === max && min !== undefined && min < 2) return null

  // Infer unit from magnitude if not found in text
  if (!unit && primary !== undefined) {
    if (primary < 200) unit = 'HOUR'
    else if (primary <= 3000) unit = 'WEEK'
    else if (primary <= 25000) unit = 'MONTH'
    else unit = 'YEAR'
  }

  // Build display string: use raw if it already has unit text, else format from parsed
  let display: string
  if (/\/hr|\/hour|per hour|per week|per year|per annum|per day|\/day|per month|hourly|weekly|yearly|annual/i.test(s)) {
    // Raw string already has readable unit text — clean whitespace only
    display = s.replace(/\s+/g, ' ').trim()
  } else if (min !== undefined && max !== undefined && min !== max) {
    const fmt = (n: number) => n >= 1000 ? `$${n.toLocaleString('en-US')}` : `$${n}`
    const unitLabel = unit === 'HOUR' ? '/hr' : unit === 'WEEK' ? '/wk' : unit === 'MONTH' ? '/mo' : unit === 'DAY' ? '/day' : '/yr'
    display = `${fmt(min)} – ${fmt(max)}${unitLabel}`
  } else if (primary !== undefined) {
    const fmt = (n: number) => n >= 1000 ? `$${n.toLocaleString('en-US')}` : `$${n}`
    const unitLabel = unit === 'HOUR' ? '/hr' : unit === 'WEEK' ? '/wk' : unit === 'MONTH' ? '/mo' : unit === 'DAY' ? '/day' : '/yr'
    const plusSign = s.includes('+') ? '+' : ''
    display = `${fmt(primary)}${plusSign}${unitLabel}`
  } else {
    return null
  }

  return { min, max, unit, display }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const JOB_COLUMNS = "id,guid,title,employer,location,location_raw,location_parent,salary,post_date,category,contract_type,contract_time,description,url,cpc,validThrough,city,state,zip,country,geo_lat,geo_lng,feedid"
const JOB_LIST_COLUMNS = "id,guid,title,employer,location,location_raw,salary,post_date,category,contract_type,contract_time,validThrough,city,state"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
  db: {
    schema: "public",
  },
})

export async function getJob(guid: string): Promise<Job | null> {
  if (!guid || guid.trim() === "") return null

  try {
    const { data, error } = await supabase
      .from("USJobs1")
      .select(JOB_COLUMNS)
      .eq("guid", guid)
      .single()

    if (error || !data) return null
    return normaliseJob(data)
  } catch {
    return null
  }
}

export const getJobById = getJob

export const getJobs = unstable_cache(
  async (page = 1, limit = 20) => {
    try {
      const offset = (page - 1) * limit

      const { data, error } = await supabase
        .from("USJobs1")
        .select(JOB_LIST_COLUMNS)
        .order("post_date", { ascending: false })
        .range(offset, offset + limit)

      if (error) {
        console.error("getJobs error:", error.message)
        return { jobs: [], totalCount: 0, totalPages: 0, hasNextPage: false }
      }

      const rows = data || []
      const hasNextPage = rows.length > limit
      const jobs = rows.slice(0, limit).map(normaliseJob).filter(Boolean) as Job[]

      return { jobs, totalCount: jobs.length, totalPages: 0, hasNextPage }
    } catch (err) {
      console.error("getJobs exception:", err)
      return { jobs: [], totalCount: 0, totalPages: 0, hasNextPage: false }
    }
  },
  ["getJobs"],
  { tags: ["jobs-list"], revalidate: 3600 }
)

export const getJobsByCategory = unstable_cache(
  async (category: string, page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit

      const { data, error } = await supabase
        .from("USJobs1")
        .select(JOB_LIST_COLUMNS)
        .eq("category", category)
        .order("post_date", { ascending: false })
        .range(offset, offset + limit)

      if (error) return { data: [], error: error.message, hasNextPage: false }

      const rows = data || []
      const hasNextPage = rows.length > limit
      const jobs = rows.slice(0, limit).map(normaliseJob).filter(Boolean) as Job[]

      return { data: jobs, hasNextPage, error: null }
    } catch {
      return { data: [], error: "Failed to fetch jobs by category", hasNextPage: false }
    }
  },
  ["getJobsByCategory"],
  { tags: ["jobs-list"], revalidate: 3600 }
)

export type JobCountry = "US" | "GB"

export async function searchJobs(
  query: string,
  page = 1,
  limit = 20,
  city?: string,
  state?: string,
  country?: JobCountry,
) {
  try {
    const offset = (page - 1) * limit
    let q = supabase.from("USJobs1").select(JOB_LIST_COLUMNS)

    if (query.trim()) {
      q = q.ilike("title", `%${query.trim()}%`)
    }
    if (city && city !== "all") {
      q = q.ilike("city", `%${city}%`)
    }
    if (state && state !== "all") {
      q = q.ilike("state", `%${state}%`)
    }
    if (country) {
      q = q.eq("country", country)
    }

    const { data, error } = await q
      .order("post_date", { ascending: false })
      .range(offset, offset + limit)

    if (error) return { jobs: [], hasNextPage: false }

    const rows = data || []
    const hasNextPage = rows.length > limit
    const jobs = rows.slice(0, limit).map(normaliseJob).filter(Boolean) as Job[]

    return { jobs, hasNextPage }
  } catch {
    return { jobs: [], hasNextPage: false }
  }
}

export const getCategories = unstable_cache(
  async () => {
    try {
      const { data, error } = await supabase.rpc("get_distinct_categories")
      if (error) return { data: [], error: error.message }
      const categories = (data as { category: string }[] || [])
        .map((row) => row.category)
        .filter(Boolean)
      return { data: categories, error: null }
    } catch {
      return { data: [], error: "Failed to fetch categories" }
    }
  },
  ["categories"],
  { tags: ["categories"], revalidate: 3600 }
)

export const getUniqueCities = unstable_cache(
  async (stateAbbr?: string, stateName?: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase.rpc("get_distinct_cities", {
        p_state: stateAbbr && stateAbbr !== "all" ? stateAbbr : null,
        p_state_name: stateName || null,
      })
      if (error) return []
      return (data as { city: string }[]).map((r) => r.city).filter(Boolean)
    } catch {
      return []
    }
  },
  ["cities"],
  { tags: ["cities"], revalidate: 3600 }
)

export const getUniqueStates = unstable_cache(
  async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase.rpc("get_distinct_states")
      if (error) return []
      return (data as { state: string }[]).map((r) => r.state).filter(Boolean)
    } catch {
      return []
    }
  },
  ["states"],
  { tags: ["states"], revalidate: 3600 }
)

import { US_STATES } from "./us-states"

const STATE_ABBR_TO_NAME = new Map<string, string>(US_STATES.map((s) => [s.abbreviation.toUpperCase(), s.name]))
const STATE_NAMES = new Set<string>(US_STATES.map((s) => s.name))

function normaliseUsState(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null
  if (STATE_NAMES.has(trimmed)) return trimmed
  const upper = trimmed.toUpperCase()
  if (STATE_ABBR_TO_NAME.has(upper)) return STATE_ABBR_TO_NAME.get(upper)!
  return null
}

export const getTopCitiesInState = unstable_cache(
  async (state: string, limit = 12, country?: JobCountry): Promise<Array<{ city: string; count: number }>> => {
    if (!state) return []
    try {
      let q = supabase
        .from("USJobs1")
        .select("city")
        .ilike("state", `%${state}%`)
        .not("city", "is", null)
        .limit(20000)
      if (country) q = q.eq("country", country)
      const { data, error } = await q
      if (error) return []
      const counts = new Map<string, number>()
      for (const row of (data as Array<{ city: string | null }>) || []) {
        const c = row.city?.trim()
        if (!c) continue
        counts.set(c, (counts.get(c) || 0) + 1)
      }
      return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([city, count]) => ({ city, count }))
    } catch {
      return []
    }
  },
  ["top-cities-in-state-v2"],
  { tags: ["jobs-list"], revalidate: 3600 }
)

export const getTopCityStates = unstable_cache(
  async (limit = 24): Promise<Array<{ city: string; state: string; count: number }>> => {
    try {
      const { data, error } = await supabase
        .from("USJobs1")
        .select("city,state")
        .not("city", "is", null)
        .not("state", "is", null)
        .limit(50000)
      if (error) return []
      const counts = new Map<string, { city: string; state: string; count: number }>()
      for (const row of (data as Array<{ city: string | null; state: string | null }>) || []) {
        const city = row.city?.trim()
        const state = normaliseUsState(row.state)
        if (!city || !state) continue
        const key = `${city}|${state}`
        const hit = counts.get(key)
        if (hit) hit.count += 1
        else counts.set(key, { city, state, count: 1 })
      }
      return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit)
    } catch {
      return []
    }
  },
  ["top-city-states"],
  { tags: ["jobs-list"], revalidate: 3600 }
)

export interface LocationAggregates {
  totalCount: number
  topCategories: Array<{ name: string; count: number }>
  topEmployers: Array<{ name: string; count: number }>
  topTitles: Array<{ name: string; count: number }>
  avgAnnualSalary: number | null
  hasSalaryData: boolean
}

const ANNUAL_MULTIPLIER: Record<string, number> = {
  HOUR: 2080,
  DAY: 260,
  WEEK: 52,
  MONTH: 12,
  YEAR: 1,
}

const LOCATION_AGG_COLUMNS = "title,employer,salary,category,city,state"

async function fetchLocationAggregates(city?: string, state?: string, country?: JobCountry): Promise<LocationAggregates> {
  const empty: LocationAggregates = {
    totalCount: 0,
    topCategories: [],
    topEmployers: [],
    topTitles: [],
    avgAnnualSalary: null,
    hasSalaryData: false,
  }
  if (!city && !state) return empty

  try {
    let countQuery = supabase.from("USJobs1").select("id", { count: "exact", head: true })
    if (city) countQuery = countQuery.ilike("city", `%${city}%`)
    if (state) countQuery = countQuery.ilike("state", `%${state}%`)
    if (country) countQuery = countQuery.eq("country", country)
    const { count } = await countQuery

    let sampleQuery = supabase.from("USJobs1").select(LOCATION_AGG_COLUMNS).limit(200)
    if (city) sampleQuery = sampleQuery.ilike("city", `%${city}%`)
    if (state) sampleQuery = sampleQuery.ilike("state", `%${state}%`)
    if (country) sampleQuery = sampleQuery.eq("country", country)
    const { data, error } = await sampleQuery
    if (error) return { ...empty, totalCount: count ?? 0 }

    const rows = (data as Array<Record<string, unknown>>) || []

    const categoryCounts = new Map<string, number>()
    const employerCounts = new Map<string, number>()
    const titleCounts = new Map<string, number>()
    let salarySum = 0
    let salaryN = 0

    for (const row of rows) {
      const cat = (row.category as string)?.trim()
      if (cat) categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1)

      const emp = (row.employer as string)?.trim()
      if (emp && emp !== "Company Not Specified") {
        employerCounts.set(emp, (employerCounts.get(emp) || 0) + 1)
      }

      const rawTitle = (row.title as string)?.trim()
      const title = rawTitle?.split(" - ")[0]
      if (title) titleCounts.set(title, (titleCounts.get(title) || 0) + 1)

      const parsed = parseSalary(row.salary as string | undefined)
      if (parsed && parsed.unit) {
        const mid = parsed.min != null && parsed.max != null
          ? (parsed.min + parsed.max) / 2
          : parsed.min ?? parsed.max
        if (mid != null && mid > 0) {
          const annual = mid * (ANNUAL_MULTIPLIER[parsed.unit] ?? 1)
          if (annual >= 5000 && annual <= 1_000_000) {
            salarySum += annual
            salaryN += 1
          }
        }
      }
    }

    const top = (m: Map<string, number>, n: number) =>
      Array.from(m.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, n)

    return {
      totalCount: count ?? rows.length,
      topCategories: top(categoryCounts, 5),
      topEmployers: top(employerCounts, 5),
      topTitles: top(titleCounts, 5),
      avgAnnualSalary: salaryN > 0 ? Math.round(salarySum / salaryN) : null,
      hasSalaryData: salaryN > 0,
    }
  } catch {
    return empty
  }
}

export const getLocationAggregates = unstable_cache(
  fetchLocationAggregates,
  ["locationAggregates-v2"],
  { tags: ["jobs-list"], revalidate: 3600 }
)

export async function getRelatedJobs(currentJob: Job, limit = 6): Promise<Job[]> {
  try {
    const { data, error } = await supabase
      .from("USJobs1")
      .select(JOB_COLUMNS)
      .neq("guid", currentJob.guid)
      .or(`employer.eq.${currentJob.employer},location.eq.${currentJob.location}`)
      .limit(limit)

    if (error) return []
    return (data || []).map(normaliseJob).filter(Boolean).slice(0, limit) as Job[]
  } catch {
    return []
  }
}

function normaliseJob(job: Record<string, unknown>): Job | null {
  if (!job) return null

  try {
    const title = (job.title as string)?.split(" - ")[0] || (job.title as string) || "Untitled Job"
    const parsed = parseSalary(job.salary as string | undefined)

    return {
      id: String(job.id ?? ""),
      guid: String(job.guid ?? ""),
      title,
      description: (job.description as string) || "No description available",
      employer: (job.employer as string) || "Company Not Specified",
      location: (job.location as string) || "Location Not Specified",
      country: (job.country as string) || "",
      post_date: (job.post_date as string) || new Date().toISOString(),
      url: job.url as string | undefined,
      salary: job.salary as string | undefined,
      salary_min: parsed?.min,
      salary_max: parsed?.max,
      salary_unit: parsed?.unit,
      salary_display: parsed?.display,
      category: job.category as string | undefined,
      contract_time: job.contract_time as string | undefined,
      contract_type: job.contract_type as string | undefined,
      location_raw: job.location_raw as string | undefined,
      location_parent: job.location_parent as string | undefined,
      city: job.city as string | undefined,
      state: job.state as string | undefined,
      zip: job.zip as string | undefined,
      geo_lat: job.geo_lat as string | undefined,
      geo_lng: job.geo_lng as string | undefined,
      validThrough: job.validThrough as string | undefined,
      cpc: job.cpc as string | undefined,
      feedid: job.feedid as string | undefined,
      street_address: job.street_address as string | undefined,
    }
  } catch {
    return null
  }
}

export function stripHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim()
}
