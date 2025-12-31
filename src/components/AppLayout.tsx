import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <Outlet />
    </div>
  );
}
