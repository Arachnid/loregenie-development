import { ModalProvider } from "@/components/providers/modal-provider";
import QueryProvider from "@/components/providers/query-provider";
import SessionProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getAllWorlds } from "@/server/actions/world";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
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
  const session = await getServerSession(authOptions);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["worlds"],
    queryFn: async () => {
      return await getAllWorlds();
    },
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-lore-beige-500 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <SessionProvider session={session}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
              storageKey="lore-genie-theme"
            >
              <HydrationBoundary state={dehydrate(queryClient)}>
                <Toaster />
                <ModalProvider />
                {children}
              </HydrationBoundary>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
