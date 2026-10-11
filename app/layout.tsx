import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Acadent",
  description: "Manage. Track. Empower.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <Suspense
          fallback={
            <main className="flex min-h-screen items-center justify-center bg-white text-sm text-midnight/60">
              Loading Acadent...
            </main>
          }
        >
          {children}
        </Suspense>
        <ToastContainer position="top-right" autoClose={3500} newestOnTop />
      </body>
    </html>
  );
}
