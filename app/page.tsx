import type { Metadata } from "next"
import HomePageWrapper from "./HomePageWrapper"

export const revalidate = false

export const metadata: Metadata = {
  title: { absolute: "AdCertified Now Jobs - Find Your Dream Job Today" },
  description:
    "Discover thousands of job opportunities across the United States. Search and apply for jobs in your area with AdCertified Now Jobs.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com",
  },
  openGraph: {
    title: "AdCertified Now Jobs - Find Your Dream Job Today",
    description: "Discover thousands of job opportunities across the United States.",
    type: "website",
    url: "https://jobs.adcertifiednow.com",
    siteName: "AdCertified Now Jobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdCertified Now Jobs - Find Your Dream Job Today",
    description: "Discover thousands of job opportunities across the United States.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return <HomePageWrapper />
}
