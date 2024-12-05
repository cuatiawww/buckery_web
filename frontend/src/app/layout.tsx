import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";


const beachDay = localFont({
  src: "./fonts/beachday.ttf",
  variable: "--font-beachday",
  weight: "100 900",
});
const ChickenSoup = localFont({
  src: "./fonts/Chicken Soup.ttf",
  variable: "--font-ChickenSoup",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Buckery - Sweet Bakery",
  description: "Delicious bakery with sweet memories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beachDay.variable} ${ChickenSoup.variable} antialiased min-h-screen`}
      >
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}