import RoleRoute from "../guards/RoleRoute";
import { protectedRoutes } from "./protectedRoutes";

export function buildProtectedRoutes() {
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
        index: true as const,
        element: routeElement,
      };
    }

    return {
      path: route.path,
      element: routeElement,
    };
  });
}