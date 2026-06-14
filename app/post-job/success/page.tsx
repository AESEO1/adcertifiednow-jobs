import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, CreditCard, CheckCircle } from "lucide-react"
import type { Metadata } from "next"
import PageLayout from "@/components/layout/PageLayout"

export const metadata: Metadata = {
  title: "Job Posted Successfully",
  description: "Your job posting has been submitted successfully. An invoice will be sent to your email shortly.",
  alternates: {
    canonical: "https://jobs.adcertifiednow.com/post-job/success",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function PostJobSuccessPage() {
  return (
    <PageLayout>
      {/* Success Message */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Job Posting Submitted Successfully!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for choosing AdCertified Now Jobs. Your job posting details have been received and are being processed.
          </p>

          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>What Happens Next?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-semibold">Review & Processing</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team will review your job posting details and prepare your listing.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-semibold">Invoice & Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    An invoice with a secure payment link will be sent to your email address within 1-2 hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-semibold">Job Goes Live</h4>
                  <p className="text-sm text-muted-foreground">
                    Once payment is received, your job will be published within 2-4 hours and start attracting
                    candidates.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h4 className="font-semibold">Applications Begin</h4>
                  <p className="text-sm text-muted-foreground">
                    Candidates will apply directly through your company website as specified in your application URL.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Important Reminder</h3>
            </div>
            <p className="text-sm text-blue-800">
              Please check your email (including spam folder) for the invoice. If you don't receive it within 2 hours,
              please contact our support team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">Browse Current Jobs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/post-job">Post Another Job</Link>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold mb-4">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about your job posting or need assistance, we're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:paul@paullovell.uk">Email Support</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
