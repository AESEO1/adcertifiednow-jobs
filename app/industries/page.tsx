import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import PageLayout from "@/components/layout/PageLayout"
import { getCategories } from "@/lib/supabase"
import { categoryToSlug } from "@/lib/category-slug"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Browse Jobs by Industry - Find Career Opportunities",
  description:
    "Explore job opportunities across different industries and sectors including healthcare, technology, finance, education, and more. Find your perfect career match by industry.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com/industries",
  },
  openGraph: {
    title: "Browse Jobs by Industry - AdCertified Now Jobs",
    description:
      "Explore job opportunities across different industries and sectors. Find your perfect career match by browsing our comprehensive industry categories.",
    type: "website",
    url: "https://jobs.adcertifiednow.com/industries",
    siteName: "AdCertified Now Jobs",
  },
  twitter: {
    card: "summary",
    title: "Browse Jobs by Industry - AdCertified Now Jobs",
    description: "Explore job opportunities across different industries and sectors. Find your perfect career match.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function IndustriesPage() {
  const { data: categories } = await getCategories()
  const list = (categories || []).slice().sort((a, b) => a.localeCompare(b))

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://jobs.adcertifiednow.com" },
      { "@type": "ListItem", position: 2, name: "Industries", item: "https://jobs.adcertifiednow.com/industries" },
    ],
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Browse Jobs by Industry",
    description:
      "Explore job opportunities across different industries and sectors. Find your perfect career match by industry.",
    url: "https://jobs.adcertifiednow.com/industries",
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    hasPart: list.map((c) => ({
      "@type": "WebPage",
      name: `${c} Jobs`,
      url: `https://jobs.adcertifiednow.com/industries/${categoryToSlug(c)}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <PageLayout>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Jobs by Industry</h1>
            <p className="text-gray-600">
              Explore job opportunities across {list.length} industries and find your perfect career match.
            </p>
          </div>

          {list.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No industries available right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((category) => (
                <Card key={category} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <Link
                        href={`/industries/${categoryToSlug(category)}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {category} Jobs
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Discover job opportunities in {category.toLowerCase()}.</p>
                    <Link href={`/industries/${categoryToSlug(category)}`}>
                      <Badge variant="outline" className="hover:bg-blue-50">
                        View {category} Jobs →
                      </Badge>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </PageLayout>
    </>
  )
}
