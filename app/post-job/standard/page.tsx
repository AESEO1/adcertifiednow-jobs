import type { Metadata } from "next"
import StandardJobForm from "../form/StandardJobForm"
import PageLayout from "@/components/layout/PageLayout"

export const metadata: Metadata = {
  title: "Post a Standard Job",
  description: "Post a standard job listing that reaches thousands of qualified candidates for 7 days.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function StandardJobPage() {
  return (
    <PageLayout>
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Post a Standard Job</h1>
            <p className="text-muted-foreground">
              Reach thousands of qualified candidates. Your job will be live for 7 days.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Price:</strong> $100 one-time • <strong>Duration:</strong> 7 days
              </p>
            </div>
          </div>

          <StandardJobForm />
        </div>
      </div>
    </PageLayout>
  )
}
