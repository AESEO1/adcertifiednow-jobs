import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "AdCertified Now Jobs - Find Your Dream Job Today",
    template: "%s | AdCertified Now Jobs",
  },
  description:
    "Discover thousands of job opportunities across the United States. Search by location, industry, or keyword to find your perfect career match.",
  authors: [{ name: "AdCertified Now Jobs" }],
  creator: "AdCertified Now Jobs",
  publisher: "AdCertified Now Jobs",
  metadataBase: new URL("https://jobs.adcertifiednow.com"),
  alternates: {
    canonical: "https://jobs.adcertifiednow.com",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "AdCertified Now Jobs - Find Your Dream Job Today",
    description:
      "Discover thousands of job opportunities across the United States. Search by location, industry, or keyword to find your perfect career match.",
    type: "website",
    url: "https://jobs.adcertifiednow.com",
    siteName: "AdCertified Now Jobs",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdCertified Now Jobs - Find Your Dream Job Today",
    description: "Discover thousands of job opportunities across the United States.",
    creator: "@todaysjobs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AdCertified Now Jobs",
  url: "https://jobs.adcertifiednow.com",
  logo: "https://jobs.adcertifiednow.com/favicon.svg",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://jobs.adcertifiednow.com/contact",
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AdCertified Now Jobs",
  url: "https://jobs.adcertifiednow.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://jobs.adcertifiednow.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
