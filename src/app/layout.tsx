import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "react-loading-skeleton/dist/skeleton.css";

import { cn } from "@/utils/cn-utils";
import { NavBar } from "@/components/compound/nav-bar";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/common/toast/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scrolls",
  description: "Chat with your documents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            inter.className,
          )}
        >
          <NavBar />
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
