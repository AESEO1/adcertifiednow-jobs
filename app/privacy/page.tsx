import type { Metadata } from "next"
import PageLayout from "@/components/layout/PageLayout"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for AdCertified Now Jobs - Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy - AdCertified Now Jobs",
    description: "Privacy Policy for AdCertified Now Jobs - Learn how we collect, use, and protect your personal information.",
    type: "article",
    url: "https://jobs.adcertifiednow.com/privacy",
    siteName: "AdCertified Now Jobs",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy - AdCertified Now Jobs",
    description: "Privacy Policy for AdCertified Now Jobs - Learn how we collect, use, and protect your personal information.",
  },
}

export default function PrivacyPolicyPage() {
  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Privacy Policy - AdCertified Now Jobs",
    url: "https://jobs.adcertifiednow.com/privacy",
    description: "Privacy Policy for AdCertified Now Jobs - Learn how we collect, use, and protect your personal information.",
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }} />

      <PageLayout>
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <p className="text-muted-foreground mb-8">
              <strong>Last updated:</strong> May 20, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                AdCertified Now Jobs ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
                and use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide Directly</h3>
              <p>We collect information you voluntarily provide when you:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Create an account or profile</li>
                <li>Post a job listing</li>
                <li>Apply for a job</li>
                <li>Contact us through our contact form or email</li>
                <li>Subscribe to our newsletters or alerts</li>
              </ul>
              <p>
                This information may include your name, email address, phone number, location, resume, cover letter, and
                other details you choose to share.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Information Collected Automatically</h3>
              <p>
                When you visit our website, we automatically collect certain information about your device and usage,
                including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>IP address and browser type</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referral source and device information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Processing job applications and postings</li>
                <li>Sending you updates, newsletters, and alerts</li>
                <li>Responding to your inquiries and support requests</li>
                <li>Improving and personalizing your experience</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>With service providers who assist us in operating our website and conducting our business</li>
                <li>When required by law or in response to legal process</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
                over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our website. You can
                control cookie preferences through your browser settings. However, disabling cookies may affect the
                functionality of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Privacy Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to opt-out of marketing communications</li>
              </ul>
              <p>To exercise these rights, please contact us at the information provided below.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices
                of these external sites. We encourage you to review the privacy policies of any third-party websites
                before providing your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
              <p>
                Our website is not intended for children under 18 years of age. We do not knowingly collect personal
                information from children. If we become aware that we have collected information from a child, we will
                delete such information promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable
                laws. We will notify you of significant changes by posting the updated policy on our website and
                updating the "Last updated" date above.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices,
                please contact us through our contact form at:
              </p>
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <p>
                  <strong>AdCertified Now Jobs</strong>
                  <br />
                  <a href="/contact" className="text-blue-600 hover:underline">
                    Contact Us
                  </a>
                  <br />
                  Website: https://jobs.adcertifiednow.com
                </p>
              </div>
            </section>
          </div>
        </main>
      </PageLayout>
    </>
  )
}
