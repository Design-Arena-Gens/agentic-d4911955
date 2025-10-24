import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShopSphere",
  description: "Full-stack commerce experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-zinc-50 antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-zinc-50">
              <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
            </main>
            <footer className="border-t border-zinc-200 bg-white">
              <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-zinc-500">
                © {new Date().getFullYear()} ShopSphere. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
