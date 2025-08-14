import { ThemeProvider } from "@/lib/components/ui/Theme-provider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>){
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}