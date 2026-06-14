import type { Metadata } from "next"
import FeaturedJobForm from "../form/FeaturedJobForm"
import PageLayout from "@/components/layout/PageLayout"

export const metadata: Metadata = {
  title: "Post a Featured Job",
  description: "Post a featured job listing with priority placement for 42 days to maximize your reach.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function FeaturedJobPage() {
  return (
    <PageLayout>
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Post a Featured Job</h1>
            <p className="text-muted-foreground">
              Get maximum visibility with priority placement. Your job will be live for 42 days.
            </p>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-900">
                <strong>Price:</strong> $200 one-time • <strong>Duration:</strong> 42 days
              </p>
            </div>
          </div>

          <FeaturedJobForm />
        </div>
      </div>
    </PageLayout>
  )
}
