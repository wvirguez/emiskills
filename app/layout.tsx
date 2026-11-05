import type { Metadata } from "next";
import { Geist, Geist_Mono, Tangerine } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

export const metadata: Metadata = {
  title: "EmiSkills - Hub de Productos Digitales",
  description: "Marketplace de productos digitales - cursos, ebooks, plantillas y membresías. Curaduría honesta para ayudarte a elegir el producto correcto.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${tangerine.variable}  h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main>
         {children}
        </main>
        <Footer />
        </body>
    </html>
  );
}
