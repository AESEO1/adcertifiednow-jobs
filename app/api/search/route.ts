import { type NextRequest, NextResponse } from "next/server"
import { searchJobs } from "@/lib/supabase"

export const revalidate = 3600

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const city = searchParams.get("city") || ""
    const state = searchParams.get("state") || ""

    const { jobs, hasNextPage } = await searchJobs(query, page, limit, city, state)

    return NextResponse.json(
      {
        jobs: jobs || [],
        hasNextPage: hasNextPage || false,
        totalCount: jobs?.length || 0,
        currentPage: page,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    )
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Failed to search jobs", jobs: [], hasNextPage: false }, { status: 500 })
  }
}
