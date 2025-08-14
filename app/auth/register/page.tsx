import Link from "next/link";
import Form from "next/form"
import { redirect, RedirectType } from "next/navigation";

export default function RegisterPage() {

    const handleSubmit = async() => {
        "use server"
        let {status} = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Gokul Venkat",
                email: "gokularise@gmail.com",
                password: "12121212"
            })
        })
        if(status===201){
            redirect("/",RedirectType.replace)
        }
    }


    return (
        <main className="flex min-h-screen items-center justify-center  px-4">
            <section className="w-full max-w-md rounded-2xl bg-secondary shadow-lg p-8">
                {/* Header */}
                <header className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-primary">Create an Account</h1>
                    <p className="mt-1 text-sm text-gray-300">
                        Sign up to get started
                    </p>
                </header>

                <Form action={handleSubmit  } formMethod="POST" className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="block w-full text-input rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-200 mb-1"
                        >
                            Email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            className="block w-full rounded-lg border text-input border-gray-300 px-3 py-2  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-200 mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            required
                            minLength={6}
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg  px-4 py-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
                    >
                        Sign up
                    </button>
                </Form>

                {/* Footer Links */}
                <footer className="mt-6 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </footer>
            </section>
        </main>
    );
}
