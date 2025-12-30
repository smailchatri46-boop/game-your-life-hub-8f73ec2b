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
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="navbar-glass-container relative h-14" style={{ width: '780px', minWidth: '780px', maxWidth: '780px' }}>
        {/* Animated noise/grain layer for visible blur */}
        <div className="navbar-noise absolute inset-0 rounded-[1.25rem] overflow-hidden pointer-events-none" />
        
        {/* Glass navbar */}
        <div className="navbar-glass relative h-14 px-4 flex items-center w-full">
          {/* Logo - fixed left */}
          <Link to="/" className="flex-shrink-0 font-display text-lg font-semibold gradient-text" style={{ width: '70px' }}>
            Locked.
          </Link>
          
          {/* Centered tabs */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-2xl text-sm transition-all duration-200 whitespace-nowrap",
                  location.pathname === item.path
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground hover:text-foreground hover:bg-white/40"
                )}
                style={location.pathname === item.path ? {
                  textShadow: '0 0 12px hsl(0 0% 100% / 0.9), 0 0 24px hsl(0 0% 100% / 0.6), 0 0 4px hsl(0 0% 100% / 0.8)'
                } : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Settings icon - fixed right */}
          <Link
            to="/settings"
            className="flex-shrink-0 p-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-white/40 transition-colors"
            style={{ width: '36px' }}
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
