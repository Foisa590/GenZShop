import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} - ${SITE_DESCRIPTION}`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hindSiliguri.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{ style: { fontFamily: "var(--font-bengali), sans-serif" } }}
          />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
