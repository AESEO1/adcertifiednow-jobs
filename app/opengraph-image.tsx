import { ImageResponse } from "next/og"

export const runtime = "nodejs"
export const alt = "AdCertified Now Jobs — Find Your Dream Job"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
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
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            Find Your Dream Job Today
          </div>
          <div style={{ fontSize: 36, opacity: 0.85 }}>
            Thousands of opportunities across the United States
          </div>
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
            Browse Jobs
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
