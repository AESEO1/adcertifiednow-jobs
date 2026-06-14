import type { Metadata } from "next"
import PageLayout from "@/components/layout/PageLayout"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AdCertified Now Jobs. We're here to help job seekers and employers connect. Contact us for support, questions, or feedback.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com/contact",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Contact Us - AdCertified Now Jobs",
    description: "Get in touch with AdCertified Now Jobs. We're here to help job seekers and employers connect.",
    url: "https://jobs.adcertifiednow.com/contact",
    siteName: "AdCertified Now Jobs",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us - AdCertified Now Jobs",
    description: "Get in touch with AdCertified Now Jobs. We're here to help job seekers and employers connect.",
  },
}

export default function ContactPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a question or need assistance? We're here to help. Reach out to us and we'll get back to you as soon
              as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in touch</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">For Job Seekers</h3>
                  <p className="text-gray-600">
                    Need help finding the perfect job? Our team is here to assist you with your job search.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">For Employers</h3>
                  <p className="text-gray-600">
                    Looking to post a job or need help with recruitment? We're here to help you find the right
                    candidates.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p className="text-gray-600">Saturday - Sunday: 10:00 AM - 4:00 PM EST</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a href="/about" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    About Us
                  </a>
                  <a href="/post-job" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    Post a Job
                  </a>
                  <a href="/privacy" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="block text-blue-600 hover:text-blue-800 transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
