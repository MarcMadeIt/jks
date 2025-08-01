import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import React from "react";
import I18nProvider from "@/i18n/i18nProvider";

const poppins = Manrope({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Junkers Køreskole",
    template: "%s - Junkers Køreskole",
  },
  description:
    "Tag kørekort i Ribe, Grindsted eller Billund hos Junkers Køreskole. Vi tilbyder både teoriundervisning og praktisk køretræning til bil, trailer, traktor og generhvervelse – med fokus på tryghed og høj beståelsesprocent.",
  metadataBase: new URL("https://www.xn--junkerskreskole-dub.dk"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Junkers Køreskole",
    description:
      "Tryg og professionel undervisning til kørekort – bil, generhvervelse, trailer og traktor. Vi holder til i Billund, Ribe og Grindsted.",
    url: "https://www.xn--junkerskreskole-dub.dk",
    siteName: "Junkers Køreskole",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Junkers Køreskole OpenGraph preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Junkers Køreskole",
    description:
      "Tryg og professionel undervisning til kørekort – bil, generhvervelse, trailer og traktor. Vi holder til i Billund, Ribe og Grindsted.",
    images: ["/opengraph-image.jpg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Junker's Køreskole",
              url: "https://www.xn--junkerskreskole-dub.dk",
              logo: "https://www.xn--junkerskreskole-dub.dk/icon-search-512x512.png",
            }),
          }}
        />
      </head>
      <body className={poppins.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
