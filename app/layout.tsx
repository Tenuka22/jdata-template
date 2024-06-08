import type { Metadata } from "next";
import "./globals.css";
import { Poppins as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "600", "800"],
});
export const metadata: Metadata = {
  title: "Jdata",
  description: "Turn your text into JSON using Jdata by Tenuka",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <meta
          name="google-site-verification"
          content="vz6G-5VZbAVKzhd7my0A41_5czVuNbrY9BLT5dGgJn0"
        />
        <Toaster />
        <main className="px-8 sm:px-20 py-10 sm:py-12">{children}</main>
      </body>
    </html>
  );
}
