export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function findCategoryBySlug(slug: string, categories: string[]): string | null {
  return categories.find((cat) => categoryToSlug(cat) === slug) ?? null
}
