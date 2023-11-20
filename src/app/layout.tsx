import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";

import Offline from "@/components/offline";

import Footer from "./(footer)/footer";
import Header from "./(header)/header";
import "./globals.css";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: "Calendrier | Le Rétro Projecteur – Cinéma de patrimoine à Paris",
  description:
    "Venez découvrir toutes les ressorties de films dans les salles parisiennes.",
  metadataBase: new URL("https://retroprojecteur.fly.dev/"),
  applicationName: "Le Rétro Projecteur",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Le Rétro Projecteur",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#fff2f2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Offline />
        <Header />
        {children}
        <Footer />
      </body>
      <GoogleTagManager gtmId="G-F5QY5F8S5L" />
    </html>
  );
}
