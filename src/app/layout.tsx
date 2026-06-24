import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sanatan Setu — Hinduism Religious Content Library",
  description:
    "A sacred digital library to upload, preserve, and explore Hindu religious content — mantras, scriptures, bhajans, Vedas, Upanishads, Puranas, and more.",
  keywords: [
    "Hinduism",
    "Sanatan Dharma",
    "Vedas",
    "Upanishads",
    "Bhagavad Gita",
    "Mantras",
    "Bhajans",
    "Ramayana",
    "Mahabharata",
    "Puranas",
  ],
  authors: [{ name: "Sanatan Setu" }],
  openGraph: {
    title: "Sanatan Setu",
    description: "A sacred library of Hinduism religious content.",
    siteName: "Sanatan Setu",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
