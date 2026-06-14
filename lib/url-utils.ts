/**
 * Converts a string to a URL-friendly slug by replacing spaces with hyphens
 * @param str - The string to convert
 * @returns URL-friendly slug with hyphens instead of spaces
 */
export function toUrlSlug(str: string): string {
  return str.replace(/\s+/g, "-").toLowerCase()
}

/**
 * Converts a URL slug back to a readable string by replacing hyphens with spaces
 * @param slug - The URL slug to convert
 * @returns Readable string with spaces
 */
export function fromUrlSlug(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ")
}

/**
 * Title-cases a space-separated string (e.g. "new york" → "New York").
 */
export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}
