/**
 * Track job application clicks with CPC value
 * @param jobId - The ID of the job being applied to
 * @param jobTitle - The title of the job
 * @param cpcValue - The cost per click value (if available)
 */
export function trackJobApplication(jobId: string, jobTitle: string, cpcValue?: number | string) {
  if (typeof window === "undefined" || !window.gtag) {
    console.log(" GA4 not loaded yet")
    return
  }

  const eventValue = cpcValue ? Number.parseFloat(String(cpcValue)) : 0

  window.gtag("event", "job_application", {
    event_category: "engagement",
    event_label: jobTitle,
    value: eventValue,
    job_id: jobId,
    cpc_value: eventValue,
  })

  console.log(" Job application tracked:", { jobId, jobTitle, cpcValue: eventValue })
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}
