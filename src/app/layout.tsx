import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guest House Ivanovka | Отдых в горах Азербайджана",
  description: "Уютный гостевой дом в Исмаиллы. Отдых в окружении величественных гор и густых лесов. Бронирование номеров, семейный отдых, романтические getaway.",
  keywords: ["Исмаиллы", "Азербайджан", "гостевой дом", "отдых в горах", "бронирование", "туризм", "природа"],
  authors: [{ name: "Guest House Ivanovka" }],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Guest House Ivanovka | Отдых в горах Азербайджана",
    description: "Уютный гостевой дом в Исмаиллы. Отдых в окружении величественных гор и густых лесов.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
