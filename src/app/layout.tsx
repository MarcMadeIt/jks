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
    default: "Junker's Køreskole",
    template: "%s - Junker's Køreskole",
  },
  description:
    "Tag kørekort i Ribe, Grindsted eller Billund hos Junker’s Køreskole. Vi tilbyder undervisning til bil, trailer, traktor og generhvervelse – med fokus på tryghed og høj beståelsesprocent",
  metadataBase: new URL("https://www.xn--junkerskreskole-dub.dk"),

  openGraph: {
    title: "Junker's Køreskole",
    description:
      "Tag dit kørekort hos Junker's Køreskole – vi tilbyder undervisning til bil, generhvervelse, trailer og traktor. Afdelinger i Billund, Ribe og Grindsted.",
    url: "https://www.xn--junkerskreskole-dub.dk",
    siteName: "Junker's Køreskole",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Junker's Køreskole OpenGraph preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Junker's Køreskole",
    description:
      "Tryg og professionel undervisning til kørekort – bil, generhvervelse, trailer og traktor. Find os i Billund, Ribe og Grindsted.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#171717",
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
