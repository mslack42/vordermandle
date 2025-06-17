import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LocalStoreProvider from "@/localstore/LocalStoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vordermandle",
  description: "A Countdown Wordlelike",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Vordermandle" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocalStoreProvider>
          <div className="w-full h-full flex flex-col justify-center  text-foreground">
            <div className="w-full h-full max-h-[800px]">
              <div className="w-full h-full flex flex-row justify-center">
                <div className="w-full max-w-[600px] max-h-[800px]">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </LocalStoreProvider>
      </body>
    </html>
  );
}
