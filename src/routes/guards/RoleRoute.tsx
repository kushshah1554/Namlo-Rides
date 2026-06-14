// src/routes/RoleRoute.tsx

import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "@/lib/auth";
import  { Role } from "@/const/enum";
import { paths } from "@/const/paths";

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
  excludedRoles?: Role[];
  redirectTo?: string;
}

function RoleRoute({
  children,
  allowedRoles,
  excludedRoles,
  // redirectTo = paths.selectRole.path,
}: RoleRouteProps) {
  const role = getUserRole() as Role | null;

  // No role selected — redirect to role selection
  if (!role) {
    return <Navigate to={paths.selectRole.path} replace />;
  }
  const redirectPath =
    role === Role.RIDER ? paths.rider.path : paths.driver.path;

  // Allowed roles check
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={redirectPath} replace />;
  }

  // Excluded roles check
  if (excludedRoles && excludedRoles.includes(role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}

export default RoleRoute;