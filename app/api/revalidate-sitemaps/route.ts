import { revalidateTag, revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Called by feed scripts after DB update. Sitemaps were removed 2026-04-09;
// discovery is now handled by the Google Indexing API. Endpoint kept for
// listing-page revalidation only.
// POST /api/revalidate-sitemaps?secret=<REVALIDATION_SECRET>&type=pages|all
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  const type = searchParams.get("type") ?? "pages"

  if (type === "pages" || type === "all" || type === "jobs" || type === "static") {
    revalidateTag("jobs-list")
    revalidateTag("categories")

    revalidatePath("/")
    revalidatePath("/search")
    revalidatePath("/industries")

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase.rpc("get_distinct_categories")
    if (data) {
      for (const row of data as { category: string }[]) {
        const slug = row.category
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
        revalidatePath(`/industries/${slug}`)
      }
    }
  }

  return NextResponse.json({ revalidated: true, type })
}
