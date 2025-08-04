import React, { useState } from 'react'

interface TestImageProps {
  src: string
  alt?: string
  className?: string
}

export default function TestImage({ src, alt = "Test image", className = "" }: TestImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    console.log('✅ Image loaded successfully:', src)
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    console.log('❌ Image failed to load:', src)
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center">
          <span className="text-xs text-gray-500">Загрузка...</span>
        </div>
      )}
      
      {hasError && (
        <div className="bg-gray-100 rounded flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading || hasError ? 'hidden' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        crossOrigin="anonymous"
      />
    </div>
  )
} 