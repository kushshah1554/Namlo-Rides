import { paths } from "@/const/paths";
import { Role } from "@/const/enum";
import type { RouteConfig } from "./types";

import SelectRolePage from "@/features/role-select";
import RiderPage from "@/features/rider";
import DriverPage from "@/features/driver";
import HistoryPage from "@/features/history";

export const protectedRoutes: RouteConfig[] = [
  {
    path: paths.selectRole.path,
    element: <SelectRolePage />,
  },
  {
    path: paths.rider.path,
    element: <RiderPage />,
    allowedRoles: [Role.RIDER],
  },
  {
    path: paths.driver.path,
    element: <DriverPage />,
    allowedRoles: [Role.DRIVER],
  },
  {
    path: paths.history.path,
    element: <HistoryPage />,
    allowedRoles: [Role.RIDER, Role.DRIVER],
  },
];