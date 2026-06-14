import { type NextRequest, NextResponse } from "next/server"
import { getJobs } from "@/lib/supabase"

export const revalidate = false

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const { jobs, totalCount, totalPages, hasNextPage } = await getJobs(page, limit)

    return NextResponse.json(
      { jobs, hasNextPage, totalCount, totalPages, currentPage: page },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    )
  } catch {
    return NextResponse.json({ error: "Failed to fetch jobs", jobs: [], hasNextPage: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      employer,
      location,
      salary,
      contract_type,
      application_url,
      featured_highlights,
      email,
      posting_type,
    } = body

    if (!title || !description || !employer || !location || !application_url || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailContent = `
New Job Posting Submitted

Posting Type: ${posting_type === "featured" ? "Featured ($200, 42 days)" : "Standard ($100, 7 days)"}

Contact Email: ${email}

Job Title: ${title}
Company: ${employer}
Location: ${location}
Salary: ${salary || "Not specified"}
Job Type: ${contract_type}
Application URL: ${application_url}

Job Description:
${description}

${featured_highlights ? `Featured Highlights:\n${featured_highlights}` : ""}

---
Please review and process this job posting.
    `

    try {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: process.env.ADMIN_EMAIL || "paul@paullovell.uk",
          subject: `New Job Posting: ${title} at ${employer}`,
          html: `<pre>${emailContent}</pre>`,
        }),
      })

      if (!emailResponse.ok) {
        const emailData = await emailResponse.json()
        console.error("Email send failed:", emailData)
      }
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Continue even if email fails
    }

    return NextResponse.json({ success: true, message: "Job posting submitted successfully" }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to process job posting" }, { status: 500 })
  }
}
