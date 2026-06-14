import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for AdCertified Now Jobs - Legal terms and conditions for using our job search platform.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service - AdCertified Now Jobs",
    description: "Terms of Service for AdCertified Now Jobs - Legal terms and conditions for using our job search platform.",
    type: "article",
    url: "https://jobs.adcertifiednow.com/terms",
    siteName: "AdCertified Now Jobs",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service - AdCertified Now Jobs",
    description: "Terms of Service for AdCertified Now Jobs - Legal terms and conditions for using our job search platform.",
  },
}

export default function TermsPage() {
  const termsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Terms of Service - AdCertified Now Jobs",
    url: "https://jobs.adcertifiednow.com/terms",
    description: "Terms of Service for AdCertified Now Jobs - Legal terms and conditions for using our job search platform.",
    isPartOf: {
      "@type": "WebSite",
      name: "AdCertified Now Jobs",
      url: "https://jobs.adcertifiednow.com",
    },
    datePublished: "2025-05-20",
    dateModified: "2025-05-20",
    author: {
      "@type": "Organization",
      name: "AdCertified Now Jobs",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
              <p className="text-gray-600">Last updated May 20, 2025</p>
            </div>

            {/* Table of Contents */}
            <div className="mb-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <a href="#agreement" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Agreement to Our Legal Terms
                </a>
                <a href="#services" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Our Services
                </a>
                <a href="#intellectual-property" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Intellectual Property Rights
                </a>
                <a href="#user-representations" className="text-blue-600 hover:text-blue-800 hover:underline">
                  User Representations
                </a>
                <a href="#prohibited-activities" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Prohibited Activities
                </a>
                <a href="#user-contributions" className="text-blue-600 hover:text-blue-800 hover:underline">
                  User Generated Contributions
                </a>
                <a href="#contribution-licence" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Contribution Licence
                </a>
                <a href="#third-party" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Third-Party Websites and Content
                </a>
                <a href="#advertisers" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Advertisers
                </a>
                <a href="#services-management" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Services Management
                </a>
                <a href="#privacy-policy" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Privacy Policy
                </a>
                <a href="#term-termination" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Term and Termination
                </a>
                <a href="#modifications" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Modifications and Interruptions
                </a>
                <a href="#governing-law" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Governing Law
                </a>
                <a href="#dispute-resolution" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Dispute Resolution
                </a>
                <a href="#corrections" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Corrections
                </a>
                <a href="#disclaimer" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Disclaimer
                </a>
                <a href="#limitations" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Limitations of Liability
                </a>
                <a href="#indemnification" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Indemnification
                </a>
                <a href="#user-data" className="text-blue-600 hover:text-blue-800 hover:underline">
                  User Data
                </a>
                <a href="#electronic-communications" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Electronic Communications
                </a>
                <a href="#california-users" className="text-blue-600 hover:text-blue-800 hover:underline">
                  California Users and Residents
                </a>
                <a href="#miscellaneous" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Miscellaneous
                </a>
                <a href="#contact" className="text-blue-600 hover:text-blue-800 hover:underline">
                  Contact Us
                </a>
              </div>
            </div>

            {/* Agreement Section */}
            <section id="agreement" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Our Legal Terms</h2>
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  We are lovell media, doing business as AdCertified Now Jobs ('Company', 'we', 'us', or 'our').
                </p>
                <p className="mb-4">
                  We operate the website https://jobs.adcertifiednow.com (the 'Site'), as well as any other related products and
                  services that refer or link to these legal terms (the 'Legal Terms') (collectively, the 'Services').
                </p>
                <p className="mb-4">
                  You can contact us by email at support@jobs.adcertifiednow.com or by mail to our registered address.
                </p>
                <p className="mb-4">
                  These Legal Terms constitute a legally binding agreement made between you, whether personally or on
                  behalf of an entity ('you'), and lovell media, concerning your access to and use of the Services. You
                  agree that by accessing the Services, you have read, understood, and agreed to be bound by all of
                  these Legal Terms.{" "}
                  <strong>
                    IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE
                    SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                  </strong>
                </p>
                <p className="mb-4">
                  The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not
                  permitted to use or register for the Services.
                </p>
              </div>
            </section>

            {/* Privacy Policy */}
            <section id="privacy-policy" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy Policy</h2>
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  We care about data privacy and security. Please review our Privacy Policy:{" "}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                    https://jobs.adcertifiednow.com/privacy
                  </Link>
                  . By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these
                  Legal Terms.
                </p>
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">23. Contact Us</h2>
              <div className="prose prose-gray max-w-none">
                <p className="mb-4">
                  In order to resolve a complaint regarding the Services or to receive further information regarding use
                  of the Services, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">lovell media</p>
                  <p>Email: support@jobs.adcertifiednow.com</p>
                  <p>
                    Website:{" "}
                    <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
                      https://jobs.adcertifiednow.com
                    </Link>
                  </p>
                </div>
              </div>
            </section>

            {/* Footer Navigation */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <Link href="/" className="hover:text-gray-900">
                  Home
                </Link>
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
                <Link href="/search" className="hover:text-gray-900">
                  Search Jobs
                </Link>
                <Link href="/post-job" className="hover:text-gray-900">
                  Post a Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
