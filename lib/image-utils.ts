export function generatePlaceholderUrl(width: number, height: number, query?: string): string {
  const baseUrl = "/placeholder.svg"
  const params = new URLSearchParams({
    width: width.toString(),
    height: height.toString(),
  })

  if (query) {
    params.set("query", query)
  }

  return `${baseUrl}?${params.toString()}`
}

export function generateCompanyLogoUrl(companyName: string, size: "sm" | "md" | "lg" = "md"): string {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  }

  const { width, height } = dimensions[size]
  return generatePlaceholderUrl(width, height, `${companyName} logo`)
}

export function generateUserAvatarUrl(name?: string, size: "sm" | "md" | "lg" = "md"): string {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  }

  const { width, height } = dimensions[size]
  const query = name ? `${name} avatar` : "user avatar"
  return generatePlaceholderUrl(width, height, query)
}

export function optimizeImageForSEO(src: string, alt: string, width?: number, height?: number) {
  return {
    src,
    alt,
    width,
    height,
    loading: "lazy" as const,
    decoding: "async" as const,
    fetchPriority: "low" as const,
  }
}

export function generateImageSizes(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(${breakpoint}) ${size}`)
    .join(", ")
}

export function createResponsiveImageSizes(maxWidth?: number): string {
  if (!maxWidth) {
    return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  }

  if (maxWidth <= 400) {
    return "(max-width: 768px) 100vw, 400px"
  }

  if (maxWidth <= 800) {
    return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  }

  return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}

export function validateImageAlt(alt: string, context?: string): string {
  if (!alt || alt.trim().length === 0) {
    console.warn(`Missing alt text${context ? ` for ${context}` : ""}`)
    return context ? `Image for ${context}` : "Image"
  }

  if (alt.length > 125) {
    console.warn(`Alt text too long (${alt.length} chars): ${alt.substring(0, 50)}...`)
    return alt.substring(0, 122) + "..."
  }

  return alt.trim()
}

export function generateBlurDataURL(width = 10, height = 10): string {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext("2d")
  if (!ctx) return ""

  // Create a simple gradient blur placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, "#f3f4f6")
  gradient.addColorStop(1, "#e5e7eb")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL()
}
