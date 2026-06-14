import type { Metadata } from "next"
import PostJobFormClient from "./PostJobFormClient"

export const metadata: Metadata = {
  title: "Post a Job - Job Posting Form",
  description:
    "Fill out our simple job posting form to hire top talent. Post your job opportunity and start receiving applications from qualified candidates.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com/post-job/form",
  },
  openGraph: {
    title: "Post a Job - Job Posting Form | AdCertified Now Jobs",
    description: "Fill out our simple job posting form to hire top talent.",
    type: "website",
    url: "https://jobs.adcertifiednow.com/post-job/form",
    siteName: "AdCertified Now Jobs",
  },
  twitter: {
    card: "summary",
    title: "Post a Job - Job Posting Form | AdCertified Now Jobs",
    description: "Fill out our simple job posting form to hire top talent.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PostJobFormPage() {
  return <PostJobFormClient />
}
