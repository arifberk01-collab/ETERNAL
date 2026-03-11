import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConditionalShell } from "@/components/ConditionalShell";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Eternal ✨",
  description: "Your shared moments, beautifully remembered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
