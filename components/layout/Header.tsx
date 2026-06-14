"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            AdCertified Now Jobs
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={isActive("/") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}
            >
              Browse Jobs
            </Link>
            <Link
              href="/industries"
              className={isActive("/industries") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}
            >
              Industries
            </Link>
            <Link
              href="/search"
              className={isActive("/search") ? "text-blue-600 font-medium" : "text-gray-600 hover:text-gray-900"}
            >
              Search
            </Link>
            <Link
              href="/post-job"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Post a Job
            </Link>
          </nav>
          {/* Mobile menu button */}
          <button className="md:hidden p-2" aria-label="Open navigation menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
