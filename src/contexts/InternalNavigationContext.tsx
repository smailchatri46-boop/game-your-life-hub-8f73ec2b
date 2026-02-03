import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

type PageType = 'dashboard' | 'overview' | 'journal' | 'goals' | 'tutorials' | 'video-tutorial' | 'settings';

interface InternalNavigationContextType {
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
}

const InternalNavigationContext = createContext<InternalNavigationContextType | null>(null);

const STORAGE_KEY = "neyler_current_page";
const DEFAULT_PAGE: PageType = "dashboard";

export function InternalNavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>(() => {
    // Restore from localStorage on initial load
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isValidPage(saved)) {
      return saved as PageType;
    }
    return DEFAULT_PAGE;
  });

  const navigateTo = useCallback((page: PageType) => {
    setCurrentPage(page);
    localStorage.setItem(STORAGE_KEY, page);
  }, []);

  // Persist page changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentPage);
  }, [currentPage]);

  return (
    <InternalNavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </InternalNavigationContext.Provider>
  );
}

export function useInternalNavigation() {
  const context = useContext(InternalNavigationContext);
  if (!context) {
    throw new Error("useInternalNavigation must be used within InternalNavigationProvider");
  }
  return context;
}

function isValidPage(page: string): page is PageType {
  return ['dashboard', 'overview', 'journal', 'goals', 'tutorials', 'video-tutorial', 'settings'].includes(page);
}
