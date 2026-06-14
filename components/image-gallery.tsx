"use client"

import { useState } from "react"
import { OptimizedImage } from "./optimized-image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
  }

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1)
    }
  }

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0)
    }
  }

  if (images.length === 0) return null

  return (
    <>
      <div className={cn("grid gap-4", className)}>
        {images.length === 1 ? (
          <div className="aspect-video relative cursor-pointer" onClick={() => openLightbox(0)}>
            <OptimizedImage
              src={images[0].src}
              alt={images[0].alt}
              fill
              className="rounded-lg object-cover hover:opacity-90 transition-opacity"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="aspect-square relative cursor-pointer" onClick={() => openLightbox(index)}>
                <OptimizedImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="rounded-lg object-cover hover:opacity-90 transition-opacity"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close gallery"
          >
            <X className="h-8 w-8" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div className="relative max-w-4xl max-h-full">
            <OptimizedImage
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority
              quality={95}
            />
            {images[selectedIndex].caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center">
                {images[selectedIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
