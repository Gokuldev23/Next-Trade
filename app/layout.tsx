import "./globals.css";
import { Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "@/lib/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

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
				<body className={inter.className}>
					<main>{children}</main>
					<Toaster richColors />
				</body>
			</html>
		</ViewTransitions>
	);
}
