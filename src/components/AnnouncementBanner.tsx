import { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground h-11 flex items-center justify-center px-4">
      <p className="text-sm font-body">
        Thinking of acquiring Neyler?{" "}
        <Link
          to="/acquisition"
          className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Watch this first →
        </Link>
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
