// src/pages/SelectRolePage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "@/const/enum";
import { getAuthUser, type AuthUser } from "@/lib/auth";
import { paths } from "@/const/paths";

function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<Role>(Role.RIDER);
  const navigate = useNavigate();

  const handleContinue = () => {
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
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-amber-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Brand lockup */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              aria-hidden
            >
              <circle cx="14" cy="12" r="5" fill="#f59e0b" />
              <path
                d="M14 17c0 0-7 5.5-7 10h14c0-4.5-7-10-7-10z"
                fill="#f59e0b"
                opacity="0.4"
              />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-white">
              Namlo<span className="text-amber-400">Rides</span>
            </span>
          </div>
          <p className="text-sm text-zinc-400">
            Real-time ride sharing across Kathmandu
          </p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Select role</CardTitle>
            <CardDescription className="text-zinc-400">
              Choose how you want to enter the simulator.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Rider */}
            <div
              onClick={() => setSelectedRole(Role.RIDER)}
              className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                selectedRole === Role.RIDER
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
              }`}
            >
              <Checkbox
                id="rider"
                checked={selectedRole === Role.RIDER}
                onCheckedChange={() => setSelectedRole(Role.RIDER)}
                className="mt-0.5 border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <div className="flex flex-col">
                <Label
                  htmlFor="rider"
                  className="cursor-pointer text-white font-semibold"
                >
                  Rider
                </Label>
                <span className="text-sm text-zinc-400">
                  Request rides and track your driver in real time.
                </span>
              </div>
            </div>

            {/* Driver */}
            <div
              onClick={() => setSelectedRole(Role.DRIVER)}
              className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                selectedRole === Role.DRIVER
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700"
              }`}
            >
              <Checkbox
                id="driver"
                checked={selectedRole === Role.DRIVER}
                onCheckedChange={() => setSelectedRole(Role.DRIVER)}
                className="mt-0.5 border-zinc-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <div className="flex flex-col">
                <Label
                  htmlFor="driver"
                  className="cursor-pointer text-white font-semibold"
                >
                  Driver
                </Label>
                <span className="text-sm text-zinc-400">
                  Accept ride requests and update live location.
                </span>
              </div>
            </div>

            <Button
              className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold"
              onClick={handleContinue}
            >
              Continue as {selectedRole === Role.RIDER ? "Rider" : "Driver"}
            </Button>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Namlo Tech · Internship Assignment 2026
        </p>
      </div>
    </main>
  );
}

export default SelectRolePage;