"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  loading?: "lazy" | "eager"
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  loading = "lazy",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Generate appropriate sizes if not provided
  const defaultSizes = fill
    ? "100vw"
    : width && width < 400
      ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          fill ? "absolute inset-0" : "",
          className,
        )}
        style={!fill ? { width, height } : undefined}
      >
        <svg
          className="h-8 w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className={cn("relative", fill ? "h-full w-full" : "", className)}>
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted animate-pulse",
            fill ? "" : "rounded",
          )}
          style={!fill ? { width, height } : undefined}
        >
          <div className="h-8 w-8 rounded-full bg-muted-foreground/20" />
        </div>
      )}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes || defaultSizes}
        quality={quality}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill ? "object-cover" : "",
          className,
        )}
      />
    </div>
  )
}

interface CompanyLogoProps {
  companyName: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function CompanyLogo({ companyName, size = "md", className }: CompanyLogoProps) {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
  }

  const { width, height } = dimensions[size]

  return (
    <OptimizedImage
      src={`/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(companyName + " logo")}`}
      alt={`${companyName} company logo`}
      width={width}
      height={height}
      className={cn("rounded-lg bg-white p-2", className)}
      quality={90}
      loading="lazy"
    />
  )
}

interface UserAvatarProps {
  name?: string
  src?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function UserAvatar({ name, src, size = "md", className }: UserAvatarProps) {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  }

  const { width, height } = dimensions[size]
  const fallbackSrc = `/placeholder.svg?height=${height}&width=${width}&query=user avatar`

  return (
    <div className={cn("relative overflow-hidden rounded-full", className)}>
      <OptimizedImage
        src={src || fallbackSrc}
        alt={name ? `${name}'s profile picture` : "User profile picture"}
        width={width}
        height={height}
        className="rounded-full"
        quality={90}
        loading="lazy"
      />
    </div>
  )
}
