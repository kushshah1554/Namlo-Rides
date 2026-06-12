// src/components/layout/TopNavComponent.tsx

import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, History, MapPin } from "lucide-react";
import { logout, getUserRole } from "@/lib/auth";
import { Role } from "@/const/enum";
import { paths } from "@/const/paths";

function TopNavComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getUserRole() as Role | null;

  const handleLogout = () => {
    logout();
    navigate(paths.auth.login.path, { replace: true });
  };

  const roleLabel = role === Role.DRIVER ? "Driver" : role === Role.RIDER ? "Rider" : null;

  const mapPath = role === Role.DRIVER ? paths.driver.path : paths.rider.path;

  const isMapActive =
    location.pathname === paths.rider.path ||
    location.pathname === paths.driver.path;

  const isHistoryActive = location.pathname === paths.history.path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* ── Left: Brand ── */}
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden
          >
            <circle cx="14" cy="12" r="5" fill="#f59e0b" />
            <path
              d="M14 17c0 0-7 5.5-7 10h14c0-4.5-7-10-7-10z"
              fill="#f59e0b"
              opacity="0.4"
            />
          </svg>
          <span className="text-lg font-bold tracking-tight text-white">
            Namlo<span className="text-amber-400">Rides</span>
          </span>

          {roleLabel && (
            <span className="ml-3 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
              {roleLabel}
            </span>
          )}
        </div>

        {/* ── Center: Nav Links ── */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(mapPath)}
            className={`text-sm gap-1.5 ${
              isMapActive
                ? "text-amber-400 bg-amber-500/10"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Map
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(paths.history.path)}
            className={`text-sm gap-1.5 ${
              isHistoryActive
                ? "text-amber-400 bg-amber-500/10"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <History className="h-4 w-4" />
            Ride History
          </Button>
        </div>

        {/* ── Right: Actions ── */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(paths.selectRole.path)}
            className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs"
          >
            Switch Role
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      <div className="flex sm:hidden items-center justify-center gap-1 border-t border-zinc-800/50 px-4 py-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(mapPath)}
          className={`text-xs gap-1.5 ${
            isMapActive
              ? "text-amber-400 bg-amber-500/10"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          Map
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(paths.history.path)}
          className={`text-xs gap-1.5 ${
            isHistoryActive
              ? "text-amber-400 bg-amber-500/10"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          <History className="h-3.5 w-3.5" />
          History
        </Button>
      </div>
    </nav>
  );
}

export default TopNavComponent;