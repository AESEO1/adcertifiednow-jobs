import { NextResponse } from "next/server"
import { getJobsByCategory } from "@/lib/supabase"

export const revalidate = false

export async function GET(request: Request, { params }: { params: { category: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const { data, error } = await getJobsByCategory(decodeURIComponent(params.category), page, limit)

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ jobs: data, page, limit }, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch jobs by category" }, { status: 500 })
  }
}
