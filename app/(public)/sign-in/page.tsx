"use client";

import Form from "next/form";
import { redirect } from "next/navigation";
import { Link } from "next-view-transitions";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { login } from "@/lib/actions/auth.action";
import { Button } from "@/lib/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";

export default function SignInPage() {
  const [state, action, isPending] = useActionState(login, null);

  const emailError = state?.errors?.email;
  const passwordError = state?.errors?.password;

  useEffect(() => {
    if (state?.success) {
      toast.success("Logged in successfully!");
      redirect("/dashboard");
    }
    if (!state?.success && state?.message) {
      toast.error(state?.message);
    }
  }, [state?.success, state?.message]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card
        style={{ viewTransitionName: "auth-form" }}
        className={`w-full ${(emailError || passwordError) && "animate-shake"} max-w-md rounded-2xl shadow-lg`}
      >
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Sign In
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form action={action} className="space-y-6">
            {/* Email */}
            <div className="grid gap-2 relative">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                defaultValue={state?.inputs?.email}
                className={`${emailError ? "ring ring-red-500" : ""}`}
              />
              <p
                id="email-error"
                className={`text-xs text-red-500 absolute top-0 right-0 transition-opacity ${
                  state?.errors?.email ? "opacity-100" : "opacity-0"
                }`}
              >
                {emailError}
              </p>
            </div>

            {/* Password */}
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                defaultValue={state?.inputs?.password}
                className={`${passwordError ? "ring ring-red-500" : ""}`}
              />
              <p
                id="password-error"
                className={`text-xs text-red-500 absolute top-0 right-0 transition-opacity ${
                  state?.errors?.password ? "opacity-100" : "opacity-0"
                }`}
              >
                {passwordError}
              </p>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </Form>

          {/* Extra links */}
          <div className="mt-4 flex justify-between text-sm">
            <a
              href="/forgot-password"
              className="text-gray-500 underline hover:text-gray-800"
            >
              Forgot password?
            </a>
            <Link
              href="/sign-up"
              className="text-gray-500 underline hover:text-gray-800"
            >
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
