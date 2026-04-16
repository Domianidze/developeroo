import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, TooltipProvider } from "@/components";
import { ConvexClientProvider } from "@/providers";
import "./globals.css";

const baseUrl = process.env.BASE_URL;

export const metadata: Metadata = {
  metadataBase: baseUrl ? new URL(baseUrl) : "",
  icons: {
    icon: [
      {
        url: "/logo.svg",
        media: "(prefers-color-scheme: light)",
        type: "image/svg+xml",
      },
      {
        url: "/logo-dark.svg",
        media: "(prefers-color-scheme: dark)",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    images: [
      {
        url: "/opengraph.png",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph.png"],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ConvexAuthNextjsServerProvider>
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </ConvexAuthNextjsServerProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
