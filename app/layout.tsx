import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import ".//globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={cn(
          "min-h-screen bg-lore-beige-500 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="lore-genie-theme"
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
