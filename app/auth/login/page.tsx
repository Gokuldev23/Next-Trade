import Link from "next/link";

export default function LoginPage() {
	return (
		<main className="flex min-h-screen items-center justify-center px-4">
			<section className="w-full max-w-md rounded-2xl bg-secondary  shadow-lg p-8">
				<header className="mb-6 text-center">
					<h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
					<p className="mt-1 text-sm text-gray-300">
						Please sign in to your account
					</p>
				</header>
				<form action="/api/auth/login" method="POST" className="space-y-5">
					{/* Email */}
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-3ray-700 mb-1"
						>
							Email address
						</label>
						<input
							type="email"
							name="email"
							id="email"
							required
							className="block w-full  rounded-lg border border-gray-300 px-3 py-2 text-3ray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="you@example.com"
						/>
					</div>

					{/* Password */}
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium  mb-1"
						>
							Password
						</label>
						<input
							type="password"
							name="password"
							id="password"
							required
							className="block w-full rounded-lg border border-gray-300 px-3 py-2  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="••••••••"
						/>
					</div>

					{/* Submit */}
					<button
						type="submit"
						className="w-full rounded-lg px-4 py-2  font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
					>
						Sign in
					</button>
				</form>

				{/* Footer Links */}
				<footer className="mt-6 flex justify-between text-sm">
					<Link
						href="/forgot-password"
						className="text-primary hover:underline"
					>
						Forgot password?
					</Link>
					<Link href="/auth/register" className="text-primary hover:underline">
						Create account
					</Link>
				</footer>
			</section>
		</main>
	);
}
