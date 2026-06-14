import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRoleSelect } from "./hooks/useRoleSelect";
import RoleSelectForm from "./components/RoleSelectForm";
import BrandLockup from "@/components/shared/BrandLockup";

export default function SelectRolePage() {
  const { selectedRole, setSelectedRole, handleContinue, buttonLabel } =
    useRoleSelect();

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
        <BrandLockup />

        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">Select role</CardTitle>
            <CardDescription className="text-zinc-400">
              Choose how you want to enter the simulator.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <RoleSelectForm
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              onContinue={handleContinue}
              buttonLabel={buttonLabel}
            />
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Namlo Tech · Internship Assignment 2026
        </p>
      </div>
    </main>
  );
}