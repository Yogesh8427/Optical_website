'use client';
import { useRef, useEffect, forwardRef } from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

/**
 * Horizontal scroll container that locks to horizontal-only when the user
 * is swiping horizontally, but allows vertical page scroll when swiping
 * vertically — even when the finger starts inside this row.
 */
const ScrollRow = forwardRef<HTMLDivElement, Props>(({ className, children }, outerRef) => {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let locked: boolean | null = null;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      locked = null;
    };

    const onMove = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);

      if (locked === null && (dx > 4 || dy > 4)) {
        locked = dx > dy; // true = horizontal swipe
      }

      if (locked === true) {
        e.preventDefault(); // stop page from scrolling vertically
      }
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
    };
  }, []);

  return (
    <div
      ref={(node) => {
        (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof outerRef === 'function') outerRef(node);
        else if (outerRef) outerRef.current = node;
      }}
      className={className}
    >
      {children}
    </div>
  );
});

ScrollRow.displayName = 'ScrollRow';
export default ScrollRow;
