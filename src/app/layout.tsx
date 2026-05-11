import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { heIL } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "hebrew"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Personal Finance PWA",
  description: "אפליקציה חכמה לניהול תקציב למשפחות",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={heIL}>
      <html lang="he" dir="rtl">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={`${inter.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
