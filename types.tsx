export type Job = {
  id: string
  guid: string
  title: string
  description: string
  employer: string
  location: string
  country: string
  post_date: string
  url?: string
  salary?: string
  salary_min?: number
  salary_max?: number
  salary_unit?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR'
  salary_display?: string
  category?: string
  contract_time?: string
  contract_type?: string
  location_raw?: string
  location_parent?: string
  city?: string
  state?: string
  zip?: string
  geo_lat?: string
  geo_lng?: string
  validThrough?: string
  cpc?: string
  feedid?: string
  street_address?: string
}

export type JobPageProps = {
  params: { id: string }
}
