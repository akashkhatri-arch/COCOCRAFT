import type { Metadata } from "next";
import { Playfair_Display, Inter, Montserrat } from "next/font/google";
import { ToastContainer } from "@/components/ui/Toast";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Truffle Tales by Parul | Premium Custom Chocolates",
  description: "Handcrafted luxury couverture chocolates and bespoke custom chocolate bars by Parul.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-cream-50 text-choco-950">{children}<ToastContainer /></body>
    </html>
  );
}

