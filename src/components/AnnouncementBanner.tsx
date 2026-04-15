import { Link } from "react-router-dom";

export function AnnouncementBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-black text-white h-11 flex items-center justify-center px-4">
      <p className="text-sm font-body">
        Thinking of acquiring Neyler?{" "}
        <Link
          to="/acquisition"
          className="font-bold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Watch this first
        </Link>
      </p>
    </div>
  );
}
