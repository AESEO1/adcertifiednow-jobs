import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

function extractGuid(slug: string): string {
  if (/^[0-9a-f\-]{36}$/i.test(slug)) return slug
  const parts = slug.split("-")
  return parts[parts.length - 1]
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const guid = extractGuid(params.id)

  const { data } = await supabase
    .from("USJobs1")
    .select("url")
    .eq("guid", guid)
    .single()

  if (!data?.url) {
    return NextResponse.redirect(new URL("/search", process.env.NEXT_PUBLIC_APP_URL || "https://jobs.adcertifiednow.com"))
  }

  let validatedUrl: URL
  try {
    validatedUrl = new URL(data.url)
    if (validatedUrl.protocol !== "http:" && validatedUrl.protocol !== "https:") {
      throw new Error("Invalid protocol")
    }
  } catch {
    return NextResponse.redirect(new URL("/search", process.env.NEXT_PUBLIC_APP_URL || "https://jobs.adcertifiednow.com"))
  }

  return NextResponse.redirect(validatedUrl.toString(), 302)
}
