import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { AmbientOrbs } from "@/components/site/ambient-orbs";
import { CustomCursor } from "@/components/site/custom-cursor";
import { getSiteSettings } from "@/lib/api-client";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const title = settings?.defaultSeoTitle ?? "Reflorescer Artesanal Natural";
  const description =
    settings?.defaultSeoDescription ??
    "Natureza, arte e cuidado transformados em experiências para o seu cotidiano.";

  return {
    title: { default: title, template: `%s | Reflorescer Artesanal Natural` },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://reflorescerartesanal.com.br"),
    openGraph: {
      title,
      description,
      type: "website",
      locale: "pt_BR",
      images: settings?.ogImageUrl ? [settings.ogImageUrl] : [],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <CustomCursor />
        <AmbientOrbs />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
