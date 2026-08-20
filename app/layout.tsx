import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://refill-inventario.elomatamoros.chatgpt.site"),
  title: "Refill - Inventario inteligente",
  description: "Escanea tu factura, organiza tus alimentos y descubre recetas con Refill.",
  openGraph: {
    title: "Refill - Inventario inteligente",
    description: "Tu cocina, más inteligente: inventario, recetas y compras desde una factura.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Refill: tu cocina, más inteligente" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refill - Inventario inteligente",
    description: "Tu cocina, más inteligente: inventario, recetas y compras desde una factura.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
