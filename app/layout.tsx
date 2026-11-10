import type { Metadata } from "next";
import { Geist, Geist_Mono, Tangerine } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteEnv } from "@/lib/env";
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_LOCALE,
  SITE_NAME,
} from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Iniciar la fuente para textos llamativos
const tangerine = Tangerine({
   subsets: ['latin'],
   weight: ['400', '700'],
   variable: '--font-tangerine',

});

export function generateMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteEnv().SITE_URL),
    title: { default: SITE_DEFAULT_TITLE, template: `%s | ${SITE_NAME}` },
    description: SITE_DEFAULT_DESCRIPTION,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title: SITE_DEFAULT_TITLE,
      description: SITE_DEFAULT_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_DEFAULT_TITLE,
      description: SITE_DEFAULT_DESCRIPTION,
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${tangerine.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-violet-700 focus:shadow-lg"
        >
          Saltar al contenido
        </a>
        <Navbar />
        <main id="contenido">
         {children}
        </main>
        <Footer />
        </body>
    </html>
  );
}
