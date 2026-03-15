import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SanskritaAI | Divine Language Architecture",
  description: "Experience the converge of ancient wisdom and modern artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@300;400;600;800&family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
