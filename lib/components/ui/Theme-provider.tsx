"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";
import "@/app/globals.css";

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
