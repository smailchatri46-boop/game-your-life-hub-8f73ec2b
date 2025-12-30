import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Overview", path: "/overview" },
  { name: "Journal", path: "/journal" },
  { name: "Goals", path: "/goals" },
  { name: "Tutorials", path: "/tutorials" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4">
      <div className="navbar-glass-container relative h-14 w-[780px]">
        {/* Animated noise/grain layer for visible blur */}
        <div className="navbar-noise absolute inset-0 rounded-[1.25rem] overflow-hidden pointer-events-none" />
        
        {/* Glass navbar */}
        <div className="navbar-glass relative h-14 px-4 flex items-center w-full">
          {/* Logo - fixed left */}
          <Link to="/" className="flex-shrink-0 font-display text-lg font-semibold gradient-text">
            Locked.
          </Link>
          
          {/* Centered tabs */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Settings icon - fixed right */}
          <Link
            to="/settings"
            className="flex-shrink-0 p-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-white/40 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
