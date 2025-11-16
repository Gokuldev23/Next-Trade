import './globals.css'
import Image from "next/image";
import { Inter } from "next/font/google";
import { Link } from 'next-view-transitions';

const inter = Inter({ subsets: ["latin"] });

export default function GlobalNotFound() {
    return (
        <html lang="en" className={inter.className}>
            <body className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-300 via-neutral-200 to-slate-50  text-black">
                <div className="text-center px-6">
                    <Image
                        src="/404_img.svg"
                        width={400}
                        height={400}
                        alt="Not Found Illustration"
                        className="mx-auto w-full mb-6 drop-shadow-lg"
                    />
                    <h1 className="text-5xl font-extrabold mb-3 tracking-tight">
                        Page Not Found
                    </h1>
                    <p className="text-gray-700 mb-8 text-lg">
                        The page you’re looking for must have vanished into the void.
                    </p>
                    <Link
                        href="/sign-in"
                        className="inline-block px-6 py-3 text-lg font-medium text-black bg-white rounded-full shadow-md hover:bg-gray-200 transition-all duration-200"
                    >
                        Go Back Home
                    </Link>
                </div>
            </body>
        </html>
    );
}
