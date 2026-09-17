import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escuelas Artísticas de Olavarría",
  description: "Mapa y base integrada de escuelas, talleres, docentes y horarios de educación cultural.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
