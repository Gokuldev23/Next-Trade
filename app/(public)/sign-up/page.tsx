"use client";

import { useActionState, useEffect } from "react";
import Form from "next/form";
import { Link } from "next-view-transitions";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/ui/card";
import { Label } from "@/lib/components/ui/label";
import { register } from "@/lib/actions/auth.action";
import { RegisterState } from "@/lib/types/auth.type";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const initialState: RegisterState = {
	success: false,
	message: "",
	errors: null,
	inputs: {
		name: "",
		email: "",
		password: "",
	},
};

export default function SignUpPage() {
	const [state, action, isPending] = useActionState(register, initialState);

	const nameError = state?.errors?.name;
	const emailError = state?.errors?.email;
	const passwordError = state?.errors?.password;

	useEffect(() => {
		if (state?.success) {
			toast.success("You have successfully created your profile!");
			redirect("/sign-in");
		}
	}, [state?.success]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<Card
				style={{ viewTransitionName: "auth-form" }}
				className={`w-full ${(emailError || passwordError) && "animate-shake"} max-w-md rounded-2xl shadow-lg`}
			>
				<CardHeader>
					<CardTitle className="text-center text-2xl font-bold">
						Create an Account
					</CardTitle>
					<CardDescription className="text-center">
						Sign up to get started
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form action={action} className="space-y-6">
						{/* Name */}
						<div className="grid gap-2 relative">
							<Label htmlFor="name">Full Name</Label>
							<Input
								id="name"
								type="text"
								name="name"
								placeholder="John Doe"
								required
							/>
							<p
								id="name-error"
								className={`text-xs text-red-500 absolute top-0 right-0 transition-opacity ${
									nameError ? "opacity-100" : "opacity-0"
								}`}
							>
								{nameError}
							</p>
						</div>

						{/* Email */}
						<div className="grid gap-2 relative">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								placeholder="you@example.com"
								required
							/>
							<p
								id="email-error"
								className={`text-xs text-red-500 absolute top-0 right-0 transition-opacity ${
									emailError ? "opacity-100" : "opacity-0"
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
							/>
							<p
								id="email-error"
								className={`text-xs text-red-500 absolute top-0 right-0 transition-opacity ${
									passwordError ? "opacity-100" : "opacity-0"
								}`}
							>
								{passwordError}
							</p>
						</div>

						{/* Submit */}
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? "Signing up..." : "Sign Up"}
						</Button>
					</Form>

					{/* Extra links */}
					<div className="mt-4 flex justify-center text-sm">
						<span className="text-gray-500">
							Already have an account?{" "}
							<Link href="/sign-in" className="underline hover:text-gray-800">
								Sign in
							</Link>
						</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
