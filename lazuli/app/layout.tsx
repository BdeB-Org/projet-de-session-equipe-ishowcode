// app/layout.js
 // Mark this as a client component

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from './api/ThemeContext/route'; // Adjust path as needed
import './globals.css'; // Your global styles if needed

// Ce composant est le composant de mise en page racine de notre application.
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lazuli",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ThemeProvider>
  );
}
