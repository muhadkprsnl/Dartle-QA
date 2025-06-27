"use client"

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia(query)

      const handler = () => setMatches(media.matches)
      setMatches(media.matches) // Set initial value

      media.addEventListener('change', handler)
      return () => media.removeEventListener('change', handler)
    }
  }, [query])

  return matches
}