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

const activeTextStyle = {
  textShadow: '0 0 16px hsl(0 0% 100%), 0 0 32px hsl(0 0% 100% / 0.8), 0 0 8px hsl(0 0% 100%)'
};

export function Navbar() {
  const location = useLocation();
  const isSettingsActive = location.pathname === "/settings";

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div 
        className="navbar-glass-container relative"
        style={{ 
          width: '780px', 
          minWidth: '780px', 
          maxWidth: '780px',
          height: '56px',
          minHeight: '56px',
          maxHeight: '56px'
        }}
      >
        {/* Glass navbar */}
        <div className="navbar-glass relative h-full px-5 flex items-center w-full">
          {/* Logo - fixed left */}
          <Link 
            to="/" 
            className="flex-shrink-0 font-display text-lg font-semibold gradient-text"
            style={{ width: '75px', minWidth: '75px' }}
          >
            Locked.
          </Link>
          
          {/* Centered tabs */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-4 py-2 rounded-2xl text-sm transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "font-bold text-foreground"
                      : "font-medium text-muted-foreground hover:text-foreground/60"
                  )}
                  style={isActive ? activeTextStyle : undefined}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Settings icon - fixed right */}
          <Link
            to="/settings"
            className={cn(
              "flex-shrink-0 p-2 rounded-2xl transition-all duration-200",
              isSettingsActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground/60"
            )}
            style={{ 
              width: '36px', 
              minWidth: '36px',
              ...(isSettingsActive ? { filter: 'drop-shadow(0 0 8px hsl(0 0% 100%)) drop-shadow(0 0 16px hsl(0 0% 100% / 0.6))' } : {})
            }}
          >
            <Settings className={cn("w-5 h-5", isSettingsActive && "stroke-[2.5px]")} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
