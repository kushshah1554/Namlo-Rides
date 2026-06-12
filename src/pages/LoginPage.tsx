import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";

import { login } from "@/lib/auth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// Reusable Field Wrapper (replaces FormItem + FormLabel + FormMessage)
// ---------------------------------------------------------------------------

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, error, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-zinc-300 text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // const from =
  //   (location.state as { from?: { pathname: string } })?.from?.pathname ??
  //   "/dashboard";

  console.log("location", location);
  // console.log("from", from);

  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null);

    // Simulate network latency so the loading state is observable.
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      login(values.email, values.password);
      navigate("/select-role", { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center px-4">
      {/* Ambient glow — purely decorative */}
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
            {/* Minimal route-pin icon */}
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
            <CardTitle className="text-white text-lg">Sign in</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your credentials to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {authError && (
              <Alert
                variant="destructive"
                className="mb-5 bg-red-950/60 border-red-800 text-red-300"
              >
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* ── Email ── */}
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

              {/* ── Password ── */}
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
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Namlo Tech · Internship Assignment 2026
        </p>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Inline spinner — no extra dep
// ---------------------------------------------------------------------------

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}