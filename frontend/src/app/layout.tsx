import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SanskritaAI | Divine Language Architecture",
<<<<<<< HEAD
  description: "Experience the convergence of ancient wisdom and modern artificial intelligence.",
=======
  description: "Experience the converge of ancient wisdom and modern artificial intelligence.",
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
<<<<<<< HEAD
        <script src="https://www.google.com/jsapi"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              google.load("elements", "1", {
                packages: "transliteration"
              });
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@300;400;600;800&family=Noto+Sans+Devanagari:wght@400;700&display=swap"
          rel="stylesheet"
        />
=======
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Marcellus&family=Outfit:wght@300;400;600;800&family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet" />
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
