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
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="navbar-glass h-14 px-3 flex items-center gap-1">
        <Link to="/" className="px-4 py-2 font-display text-lg font-semibold gradient-text">
          Locked.
        </Link>
        
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Link
          to="/settings"
          className="p-2 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-white/50 transition-colors ml-1"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
}
