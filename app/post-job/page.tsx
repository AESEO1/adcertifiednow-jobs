import { Check, Zap, Target, Users, ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import PageLayout from "@/components/layout/PageLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Post a Job - Hire Top Talent",
  description:
    "Post your job on AdCertified Now Jobs and reach thousands of qualified candidates. Choose from our Standard or Featured job posting options.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com/post-job",
  },
  openGraph: {
    title: "Post a Job - Hire Top Talent | AdCertified Now Jobs",
    description: "Post your job on AdCertified Now Jobs and reach thousands of qualified candidates.",
    siteName: "AdCertified Now Jobs",
    type: "website",
    url: "https://jobs.adcertifiednow.com/post-job",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PostJobPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Post a Job - AdCertified Now Jobs",
    url: "https://jobs.adcertifiednow.com/post-job",
    description: "Post your job on AdCertified Now Jobs and reach thousands of qualified candidates.",
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    provider: {
      "@type": "Organization",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Standard 7-day job ad",
        description: "Perfect for roles that drive high-volume applications.",
        price: "100",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Featured 6-week job ad",
        description: "Best option to maximise your opportunity to secure the perfect match",
        price: "200",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageLayout>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Hire Top Talent Today</h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Reach thousands of qualified candidates across the United States
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <span>50,000+ Active Job Seekers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6" />
                <span>Targeted by Industry & Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-6 h-6" />
                <span>Quick & Easy Setup</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that works best for your hiring needs</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard Plan */}
            <Card className="border-2 hover:border-blue-600 transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">Standard Job Post</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Perfect for most roles</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold">$100</span>
                  <span className="text-muted-foreground ml-2">one-time</span>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>7 days live on our platform</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Featured on search results</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Direct application link</span>
                  </li>
                </ul>

                <Button asChild className="w-full" size="lg">
                  <Link href="/post-job/standard">
                    Post Standard Job
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Featured Plan */}
            <Card className="border-2 border-purple-600 bg-gradient-to-br from-purple-50 to-transparent relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Featured Job Post</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Maximize your reach</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold">$200</span>
                  <span className="text-muted-foreground ml-2">one-time</span>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>42 days live on our platform</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Prominent featured placement</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span>Job recommendations</span>
                  </li>
                </ul>

                <Button asChild className="w-full" size="lg" variant="default">
                  <Link href="/post-job/featured">
                    Post Featured Job
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What happens after I post a job?</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  After submitting your job posting, our team reviews it within 2 hours. Once approved, you'll receive
                  an invoice via email. After payment, your job goes live on our platform and starts reaching
                  candidates.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Can I edit my job posting?</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Yes! You can edit your job posting at any time during the active period. Just log into your dashboard
                  and make the changes you need.
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's the difference between Standard and Featured?</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Standard posts are live for 7 days, while Featured posts are live for 42 days. Featured posts also get
                  priority placement and appear more prominently in search results.
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </PageLayout>
    </>
  )
}
