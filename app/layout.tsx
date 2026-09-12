import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hockey Club · Gym",
  description: "Un gym interactif pour composer son trio et explorer les fiches de joueurs.",
  other: {
    "codex-preview": "development",
  },
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
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
