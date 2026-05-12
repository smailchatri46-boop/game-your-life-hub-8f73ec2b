import { useEffect, useRef, useState, useCallback } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Shared observer cache with reference counting so observers are
// disconnected and removed when no components are using them anymore.
interface CacheEntry {
  observer: IntersectionObserver;
  count: number;
}

const observerCache = new Map<string, CacheEntry>();

function acquireObserver(threshold: number, rootMargin: string): IntersectionObserver {
  const key = `${threshold}-${rootMargin}`;
  let entry = observerCache.get(key);

  if (!entry) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cb = (entry.target as any).__scrollCallback;
          if (cb) cb(entry);
        });
      },
      { threshold, rootMargin }
    );
    entry = { observer, count: 0 };
    observerCache.set(key, entry);
  }

  entry.count += 1;
  return entry.observer;
}

function releaseObserver(threshold: number, rootMargin: string): void {
  const key = `${threshold}-${rootMargin}`;
  const entry = observerCache.get(key);
  if (!entry) return;

  entry.count -= 1;
  if (entry.count <= 0) {
    entry.observer.disconnect();
    observerCache.delete(key);
  }
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

    const observer = acquireObserver(threshold, rootMargin);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      delete (element as any).__scrollCallback;
      releaseObserver(threshold, rootMargin);
    };
  }, [threshold, rootMargin, handleIntersection]);

  return { ref, isVisible };
}
