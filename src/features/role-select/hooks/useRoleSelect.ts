import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "@/const/enum";
import { getAuthUser, type AuthUser } from "@/lib/auth";
import { paths } from "@/const/paths";

export function useRoleSelect() {
  const [selectedRole, setSelectedRole] = useState<Role>(Role.RIDER);
  const navigate = useNavigate();

  function handleContinue() {
    const user = getAuthUser();

    if (!user) {
      navigate(paths.auth.login.path, { replace: true });
      return;
    }

    // Update user with selected role
    const updatedUser: AuthUser = {
      ...user,
      role: selectedRole,
    };

    sessionStorage.setItem("namlo_auth", JSON.stringify(updatedUser));

    // Navigate to role-specific page
    const targetPath =
      selectedRole === Role.RIDER ? paths.rider.path : paths.driver.path;

    navigate(targetPath, { replace: true });
  }

  function getButtonLabel(): string {
    return selectedRole === Role.RIDER
      ? "Continue as Rider"
      : "Continue as Driver";
  }

  return {
    selectedRole,
    setSelectedRole,
    handleContinue,
    buttonLabel: getButtonLabel(),
  };
}