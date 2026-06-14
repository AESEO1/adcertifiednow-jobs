import type { Metadata } from "next"
import PageLayout from "@/components/layout/PageLayout"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about AdCertified Now Jobs - your trusted partner in connecting job seekers with opportunities across the United States.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com/about",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "About Us - AdCertified Now Jobs",
    description:
      "Learn about AdCertified Now Jobs - your trusted partner in connecting job seekers with opportunities across the United States.",
    url: "https://jobs.adcertifiednow.com/about",
    siteName: "AdCertified Now Jobs",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us - AdCertified Now Jobs",
    description:
      "Learn about AdCertified Now Jobs - your trusted partner in connecting job seekers with opportunities across the United States.",
  },
}

export default function AboutPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-900 text-center">About AdCertified Now Jobs</h1>
            <p className="mt-4 text-xl text-gray-600 text-center max-w-3xl mx-auto">
              Connecting talented professionals with meaningful career opportunities across the United States
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Mission Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                At AdCertified Now Jobs, we believe that everyone deserves access to meaningful employment opportunities. Our
                mission is to bridge the gap between talented job seekers and employers looking for the right fit.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                We're committed to making the job search process more efficient, transparent, and accessible for
                professionals across all industries and experience levels.
              </p>
            </div>
          </section>

          {/* What We Do Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Job Seekers</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Access thousands of job opportunities across the United States
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Advanced search and filtering capabilities
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Real-time job alerts and notifications
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    User-friendly application process
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Employers</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Easy job posting and management tools
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Access to a diverse pool of qualified candidates
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Streamlined recruitment process
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    Competitive pricing and flexible packages
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
                  <p className="text-gray-700">
                    We believe in clear, honest communication throughout the entire job search and hiring process.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                  <p className="text-gray-700">
                    We continuously improve our platform with cutting-edge technology to enhance user experience.
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Inclusivity</h3>
                  <p className="text-gray-700">
                    We're committed to creating equal opportunities for all, regardless of background or experience
                    level.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Have questions or feedback? We'd love to hear from you. Our team is here to help you make the most of
                your experience with AdCertified Now Jobs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/post-job"
                  className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
                >
                  Post a Job
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}
