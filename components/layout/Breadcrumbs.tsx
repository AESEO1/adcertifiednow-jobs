import Link from "next/link"

interface BreadcrumbItem {
  name: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm text-gray-600 ${className ?? ""}`}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={`${item.name}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && <span aria-hidden="true" className="text-gray-400">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="text-blue-700 hover:underline">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? "text-gray-900 font-medium" : ""} aria-current={isLast ? "page" : undefined}>
                  {item.name}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
