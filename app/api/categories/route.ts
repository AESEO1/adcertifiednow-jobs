import { NextResponse } from "next/server"
import { getCategories } from "@/lib/supabase"

export const revalidate = 3600

export async function GET() {
  try {
    const { data, error } = await getCategories()

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json(
      { categories: data },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      },
    )
  } catch (error) {
    console.error("Categories API error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
