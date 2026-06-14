import { type JSX } from "react";
import { type Role } from "@/const/enum";

export interface RouteConfig {
  path?: string;
  index?: boolean;
  element: JSX.Element;
  allowedRoles?: Role[];
  excludedRoles?: Role[];
}