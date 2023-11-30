import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ReactNode } from "react";
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
        {children}
      </body>
    </html>
  );
}
