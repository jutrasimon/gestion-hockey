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
    <html lang="fr" data-theme="dark" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{__html: `try{var theme=localStorage.getItem('hockey-theme');if(theme==='light'||theme==='dark')document.documentElement.dataset.theme=theme}catch(e){}`}} /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
