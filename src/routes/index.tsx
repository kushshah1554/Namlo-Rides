import { useRoutes } from "react-router-dom";
import { paths } from "@/const/paths";

// Layout
import Layout from "@/components/layout/Layout";

// Guards
import PrivateRoute from "./guards/PrivateRoute";
import AlreadyAuthenticatedRoute from "./guards/AlreadyAuthenticatedRoute";

// Pages
import LoginPage from "@/features/auth";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";

// Route builder
import { buildProtectedRoutes } from "./config/buildRoutes";

export default function Router() {
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