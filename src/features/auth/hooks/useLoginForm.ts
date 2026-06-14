import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { login } from "@/lib/auth";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";
import { paths } from "@/const/paths";

export function useLoginForm() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setAuthError(null);

    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      login(values.email, values.password);
      navigate(paths.selectRole.path, { replace: true });
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return {
    form,
    authError,
    onSubmit: form.handleSubmit(onSubmit),
  };
}