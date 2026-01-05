import { useEffect, useRef, useState, useCallback } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Shared observer for better performance - reduces observer instances
const observerCache = new Map<string, IntersectionObserver>();

function getObserver(
  threshold: number,
  rootMargin: string,
  callback: (entry: IntersectionObserverEntry) => void
): IntersectionObserver {
  const key = `${threshold}-${rootMargin}`;
  
  if (!observerCache.has(key)) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cb = (entry.target as any).__scrollCallback;
          if (cb) cb(entry);
        });
      },
      { threshold, rootMargin }
    );
    observerCache.set(key, observer);
  }
  
  return observerCache.get(key)!;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);

  const handleIntersection = useCallback((entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
      if (!hasTriggered.current || !triggerOnce) {
        setIsVisible(true);
        hasTriggered.current = true;
      }
    } else if (!triggerOnce) {
      setIsVisible(false);
    }
  }, [triggerOnce]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Attach callback to element for shared observer pattern
    (element as any).__scrollCallback = handleIntersection;

    const observer = getObserver(threshold, rootMargin, handleIntersection);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      delete (element as any).__scrollCallback;
    };
  }, [threshold, rootMargin, handleIntersection]);

  return { ref, isVisible };
}
