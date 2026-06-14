import { NextResponse } from "next/server"
import { getUniqueCities, getUniqueStates } from "@/lib/supabase"

export const revalidate = 3600

export async function GET() {
  try {
    const [cities, states] = await Promise.all([getUniqueCities(), getUniqueStates()])

    return NextResponse.json(
      { cities, states },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    )
  } catch (error) {
    console.error("Filters API error:", error)
    return NextResponse.json({ error: "Failed to fetch filters", cities: [], states: [] }, { status: 500 })
  }
}
