// src/app/router.tsx

import { useRoutes } from "react-router-dom";
import { type JSX } from "react";

// Pages
import LoginPage from "@/pages/LoginPage";
import SelectRolePage from "@/pages/SelectRolePage";

// Layout & Guards
import Layout from "@/components/layout/Layout";
import PrivateRoute from "@/routes/PrivateRoute";
import AlreadyAuthenticatedRoute from "@/routes/AlreadyAuthenticatedRoute";
import RoleRoute from "@/routes/RoleRoute";

// Constants
import { paths } from "@/const/paths";
import { Role } from "@/const/enum";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";
import RiderPage from "@/pages/RiderPage";
import DriverPage from "@/pages/DriverPage";
import HistoryPage from "@/pages/HistoryPage";

// ---------------------------------------------------------------------------
// Placeholder pages
// ---------------------------------------------------------------------------








// ---------------------------------------------------------------------------
// Route Config Interface
// ---------------------------------------------------------------------------
interface RouteConfig {
  path?: string;
  index?: boolean;
  element: JSX.Element;
  allowedRoles?: Role[];
  excludedRoles?: Role[];
}

// ---------------------------------------------------------------------------
// Protected Routes Config
// ---------------------------------------------------------------------------
const protectedRoutes: RouteConfig[] = [
  // Select role (no role required — this is where role gets assigned)
  {
    path: paths.selectRole.path,
    element: <SelectRolePage />,
  },

  // Rider
  {
    path: paths.rider.path,
    element: <RiderPage />,
    allowedRoles: [Role.RIDER],
  },

  // Driver
  {
    path: paths.driver.path,
    element: <DriverPage />,
    allowedRoles: [Role.DRIVER],
  },

  // History (both roles)
  {
    path: paths.history.path,
    element: <HistoryPage/>,
    allowedRoles: [Role.RIDER, Role.DRIVER],
  },
];
// ---------------------------------------------------------------------------
// Build Protected Routes Dynamically
// ---------------------------------------------------------------------------
function buildProtectedRoutes() {
  return protectedRoutes.map((route) => {
    let routeElement = route.element;

    if (route.allowedRoles) {
      routeElement = (
        <RoleRoute allowedRoles={route.allowedRoles}>
          {route.element}
        </RoleRoute>
      );
    } else if (route.excludedRoles) {
      routeElement = (
        <RoleRoute excludedRoles={route.excludedRoles}>
          {route.element}
        </RoleRoute>
      );
    }

    if (route.index) {
      return {
        index: true ,
        element: routeElement,
      };
    }

    return {
      path: route.path,
      element: routeElement,
    };
  });
}

// ---------------------------------------------------------------------------
// Router Component
// ---------------------------------------------------------------------------
function Router() {
  const routes = useRoutes([
    // Public — Login
    {
      path: paths.auth.login.path,
      element: (
        <AlreadyAuthenticatedRoute>
          <LoginPage />
        </AlreadyAuthenticatedRoute>
      ),
    },

    // Private — Layout wraps all protected children
    {
      path: paths.home.path,
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: buildProtectedRoutes(),
    },

    // Catch-all
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return routes;
}

export default Router;