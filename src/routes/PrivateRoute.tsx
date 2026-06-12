// src/routes/PrivateRoute.tsx

import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { paths } from "@/const/paths";


interface PrivateRouteProps {
  children: ReactElement;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate to={paths.auth.login.path} state={{ from: location }} replace />
    );
  }

  return children;
}

export default PrivateRoute;