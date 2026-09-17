import type { Metadata } from "next";
import "./globals.css";
import palette from "./palette.json";

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
      <head><style>{`:root{${palette.map(p=>`--palette-${p.key}:${p.value}`).join(";")}}`}</style><script dangerouslySetInnerHTML={{__html: `try{var theme=localStorage.getItem('hockey-theme');if(theme==='light'||theme==='dark')document.documentElement.dataset.theme=theme}catch(e){};try{var colors=JSON.parse(localStorage.getItem('hockey-palette-v1')||'{}');for(var key of ${JSON.stringify(palette.map(p=>p.key))}){if(/^#[0-9a-f]{6}$/i.test(colors[key]||''))document.documentElement.style.setProperty('--palette-'+key,colors[key])}}catch(e){}`}} /></head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
