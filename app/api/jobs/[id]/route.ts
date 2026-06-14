import { type NextRequest, NextResponse } from "next/server"
import { getJob } from "@/lib/supabase"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await getJob(params.id)

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404, headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
      )
    }

    return NextResponse.json(
      { job },
      { headers: { "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=14400" } }
    )
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
