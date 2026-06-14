import { ImageResponse } from "next/og"
import { getJobById } from "@/lib/supabase"

export const runtime = "nodejs"
export const revalidate = 86400
export const alt = "Job on AdCertified Now Jobs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

function extractGuidFromSlug(slug: string): string {
  if (/^[0-9a-f\-]{36}$/i.test(slug)) return slug
  const parts = slug.split("-")
  return parts[parts.length - 1]
}

export default async function OpengraphImage({ params }: { params: { id: string } }) {
  const { id } = await (params as unknown as Promise<{ id: string }>)
  const guid = extractGuidFromSlug(id)
  const job = await getJobById(guid)

  const title = job?.title ?? "Job Opportunity"
  const employer = job?.employer ?? ""
  const location = job?.location ?? ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 32, opacity: 0.85 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#3b82f6",
              marginRight: 20,
            }}
          />
          Today&apos;s Jobs
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 30,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
          {employer ? (
            <div style={{ fontSize: 40, opacity: 0.95, marginBottom: 12 }}>{employer}</div>
          ) : null}
          {location ? (
            <div style={{ fontSize: 34, opacity: 0.8 }}>📍 {location}</div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            opacity: 0.85,
          }}
        >
          <div>jobs.adcertifiednow.com</div>
          <div
            style={{
              padding: "14px 28px",
              borderRadius: 999,
              background: "#3b82f6",
              fontWeight: 700,
            }}
          >
            Apply Now
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
