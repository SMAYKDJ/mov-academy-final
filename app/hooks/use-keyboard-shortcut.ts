'use client';

import { useEffect, useCallback } from 'react';

/**
 * Hook personalizado para lidar com atalhos de teclado.
 * Suporta teclas modificadoras (Ctrl, Shift, Alt, Meta).
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean } = {}
) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { ctrl, shift, alt, meta } = modifiers;

      if (ctrl && !event.ctrlKey && !event.metaKey) return;
      if (shift && !event.shiftKey) return;
      if (alt && !event.altKey) return;
      if (meta && !event.metaKey) return;

      if (event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        callback();
      }
    },
    [key, callback, modifiers]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
