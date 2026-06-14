import { notFound } from "next/navigation"
import type { Metadata } from "next"
import CategoryJobsClient from "./CategoryJobsClient"
import { getCategories, getJobsByCategory } from "@/lib/supabase"
import { categoryToSlug, findCategoryBySlug } from "@/lib/category-slug"
import Breadcrumbs from "@/components/layout/Breadcrumbs"

// Pre-render all category pages; revalidated on-demand by the feed script via
// revalidatePath in /api/revalidate-sitemaps
export const dynamicParams = true

export async function generateStaticParams() {
  const { data: categories } = await getCategories()
  if (!categories) return []
  return categories
    .filter((c): c is string => !!c)
    .map((c) => ({ category: categoryToSlug(c) }))
}

interface CategoryPageProps {
  params: { category: string }
  searchParams: { page?: string }
}

async function resolveCategory(slug: string): Promise<string | null> {
  const { data: categories } = await getCategories()
  return findCategoryBySlug(slug, categories || [])
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await resolveCategory(params.category)
  if (!category) return { title: "Industry Not Found" }

  const slug = categoryToSlug(category)

  return {
    title: `${category} Jobs - Find ${category} Career Opportunities`,
    description: `Explore ${category.toLowerCase()} job opportunities across the United States. Find and apply for ${category.toLowerCase()} positions that match your skills and experience.`,
    keywords: `${category.toLowerCase()} jobs, ${category.toLowerCase()} careers, ${category.toLowerCase()} employment, ${category.toLowerCase()} positions`,
    alternates: {
      canonical: `https://jobs.adcertifiednow.com/industries/${slug}`,
    },
    openGraph: {
      title: `${category} Jobs - AdCertified Now Jobs`,
      description: `Find ${category.toLowerCase()} job opportunities. Browse and apply for jobs in the ${category.toLowerCase()} industry.`,
      type: "website",
      url: `https://jobs.adcertifiednow.com/industries/${slug}`,
      siteName: "AdCertified Now Jobs",
    },
    twitter: {
      card: "summary",
      title: `${category} Jobs - AdCertified Now Jobs`,
      description: `Find ${category.toLowerCase()} job opportunities. Browse and apply for jobs in the ${category.toLowerCase()} industry.`,
    },
    robots: { index: true, follow: true },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = Number.parseInt(searchParams.page || "1")
  const category = await resolveCategory(params.category)

  if (!category) notFound()

  const slug = categoryToSlug(category)

  const { data: initialJobs } = await getJobsByCategory(category, currentPage, 10)

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://jobs.adcertifiednow.com" },
      { "@type": "ListItem", position: 2, name: "Industries", item: "https://jobs.adcertifiednow.com/industries" },
      { "@type": "ListItem", position: 3, name: `${category} Jobs`, item: `https://jobs.adcertifiednow.com/industries/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Industries", href: "/industries" },
          { name: `${category} Jobs` },
        ]}
        className="max-w-7xl mx-auto px-4 pt-4"
      />
      <CategoryJobsClient category={category} initialPage={currentPage} initialJobs={initialJobs || []} />
    </>
  )
}
