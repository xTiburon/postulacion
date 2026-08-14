import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://postulacion.planetmc.net"),
  title: "Postulaciones Staff — PlanetMC",
  description: "Sistema oficial de postulaciones de Staff de PlanetMC.",
  openGraph: {
    title: "Postulaciones Staff — PlanetMC",
    description: "Sistema oficial de postulaciones de Staff de PlanetMC.",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary",
    title: "Postulaciones Staff — PlanetMC",
    description: "Sistema oficial de postulaciones de Staff de PlanetMC.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="starfield" aria-hidden="true" />
        <div className="nebula" aria-hidden="true" />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
