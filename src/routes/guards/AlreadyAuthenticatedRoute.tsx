// src/routes/AlreadyAuthenticatedRoute.tsx

import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { Role } from "@/const/enum";
import { paths } from "@/const/paths";

interface AlreadyAuthenticatedRouteProps {
  children: ReactElement;
}

function AlreadyAuthenticatedRoute({
  children,
}: AlreadyAuthenticatedRouteProps) {
  if (!isAuthenticated()) {
    return children;
  }

  const role = getUserRole();

  // If authenticated but no role selected, go to role selection
  if (!role) {
    return <Navigate to={paths.selectRole.path} replace />;
  }

  // If authenticated and role exists, go to role-specific page
  const redirectPath =
    role === Role.RIDER ? paths.rider.path : paths.driver.path;

  return <Navigate to={redirectPath} replace />;
}

export default AlreadyAuthenticatedRoute;