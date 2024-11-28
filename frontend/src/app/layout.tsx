import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${beachDay.variable} ${ChickenSoup.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
