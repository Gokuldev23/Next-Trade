import "./globals.css";
import { Inter, Rock_Salt } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import AuthProvider from "@/lib/components/providers/AuthProvider";
import { Toaster } from "@/lib/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rockSalt = Rock_Salt({ weight: "400", variable: "--font-rocksalt" });

export const metadata = {
	title: "Nxt Trade - Trading Portfolio Management",
	description:
		"Professional trading portfolio management and analytics platform",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ViewTransitions>
			<html lang="en">
				<body className={`${inter.variable} ${rockSalt.variable}`}>
					<AuthProvider initialUser={null}>
						<div>
							<main>{children}</main>
							<Toaster richColors />
						</div>
					</AuthProvider>
				</body>
			</html>
		</ViewTransitions>
	);
}
