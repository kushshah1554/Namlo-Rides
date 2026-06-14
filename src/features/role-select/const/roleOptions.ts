import { Role } from "@/const/enum";

export interface RoleOptionConfig {
  role: Role;
  label: string;
  description: string;
  checkboxId: string;
}

export const ROLE_OPTIONS: RoleOptionConfig[] = [
  {
    role: Role.RIDER,
    label: "Rider",
    description: "Request rides and track your driver in real time.",
    checkboxId: "rider",
  },
  {
    role: Role.DRIVER,
    label: "Driver",
    description: "Accept ride requests and update live location.",
    checkboxId: "driver",
  },
];