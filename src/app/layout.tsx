import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guest House Gabala | Отдых в горах Азербайджана",
  description: "Уютный гостевой дом в Габале. Отдых в окружении величественных гор и густых лесов. Бронирование номеров, семейный отдых, романтические getaway.",
  keywords: ["Габала", "Азербайджан", "гостевой дом", "отдых в горах", "бронирование", "туризм", "природа"],
  authors: [{ name: "Guest House Gabala" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Guest House Gabala | Отдых в горах Азербайджана",
    description: "Уютный гостевой дом в Габале. Отдых в окружении величественных гор и густых лесов.",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
