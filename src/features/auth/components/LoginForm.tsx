import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FieldWrapper from "./FieldWrapper";
import SpinnerIcon from "./SpinnerIcon";
import type { useLoginForm } from "../hooks/useLoginForm";

interface LoginFormProps {
  form: ReturnType<typeof useLoginForm>["form"];
  authError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
  form,
  authError,
  onSubmit,
}: LoginFormProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <>
      {authError && (
        <Alert
          variant="destructive"
          className="mb-5 bg-red-950/60 border-red-800 text-red-300"
        >
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Email */}
        <FieldWrapper label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@namlotech.com"
            autoComplete="email"
            disabled={isSubmitting}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
            {...register("email")}
          />
        </FieldWrapper>

        {/* Password */}
        <FieldWrapper label="Password" error={errors.password?.message}>
          <Input
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isSubmitting}
            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-amber-500 focus-visible:border-amber-500"
            {...register("password")}
          />
        </FieldWrapper>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold transition-colors disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon />
              Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </>
  );
}