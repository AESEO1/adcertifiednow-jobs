export async function GET(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = searchParams.get("destination")

    if (!destination) {
      return new Response("No destination URL provided", { status: 400 })
    }

    try {
      new URL(destination)
    } catch {
      return new Response("Invalid destination URL", { status: 400 })
    }

    return Response.redirect(destination, 302)
  } catch {
    return new Response("Redirect error", { status: 500 })
  }
}
