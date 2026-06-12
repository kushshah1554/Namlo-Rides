// src/components/layout/Layout.tsx

import { Outlet } from "react-router-dom";
import { getUserRole } from "@/lib/auth";
import TopNavComponent from "./TopNavComponent";

function Layout() {
  const role = getUserRole();

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {role && <TopNavComponent />}
      <Outlet />
    </div>
  );
}

export default Layout;