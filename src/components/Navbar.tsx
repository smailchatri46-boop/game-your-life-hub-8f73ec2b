import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import neylerLogo from "@/assets/neyler-logo.png";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Overview", path: "/overview" },
  { name: "Journal", path: "/journal" },
  { name: "Goals", path: "/goals" },
  { name: "Tutorials", path: "/tutorials" },
];


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
            className="flex-shrink-0"
            style={{ width: '100px', minWidth: '100px' }}
          >
            <img src={neylerLogo} alt="Neyler" className="h-6 w-auto" />
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
              minWidth: '36px'
            }}
          >
            <Settings className={cn("w-5 h-5", isSettingsActive && "stroke-[2.5px]")} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
