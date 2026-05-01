'use client';

import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar correspondências de media query.
 * Seguro para SSR: o padrão é falso no servidor.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
