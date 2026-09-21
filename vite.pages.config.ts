import { defineConfig } from 'vite';
import {readFileSync} from 'node:fs';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Publish the original client UI under GitHub Pages' repository subdirectory.
const base = '/gestion-hockey/';
export default defineConfig({
  base,
  plugins: [
    {
      name:'ui-gym-shared-foundation',
      generateBundle(){
        const read=(path:string)=>readFileSync(new URL(path,import.meta.url),'utf8');
        const masters=JSON.parse(read('./app/palette-masters.json'));
        const derived=JSON.parse(read('./app/palette.json'));
        const css=':root{'+[...masters,...derived].map((p:{key:string;value:string})=>'--palette-'+p.key+':'+p.value).join(';')+'}'+read('./app/ui-gym-foundation.css').replaceAll("/fonts/",base+'fonts/');
        this.emitFile({type:'asset',fileName:'ui-gym-shared.css',source:css});
        this.emitFile({type:'asset',fileName:'ui-gym-shared.js',source:read('./app/ui-gym-runtime.js').replace('PALETTE_KEYS',JSON.stringify(masters.map((p:{key:string})=>p.key)))});
      },
      transformIndexHtml(html){return html.replace('</head>','<link rel="stylesheet" href="'+base+'ui-gym-shared.css"><script src="'+base+'ui-gym-shared.js" defer></script></head>');}
    },
    {
      name: 'pages-public-paths',
      enforce: 'pre',
      transform(code, id) {
        if (!id.replaceAll('\\', '/').includes('/app/') || !id.endsWith('.tsx')) return;
        return code
          .replaceAll('"/avatars/', `"${base}avatars/`)
          .replaceAll('"/recherche-stats-avancees.md"', `"${base}recherche-stats-avancees.md"`)
          .replaceAll('href="/"', `href="${base}"`);
      },
    },
    react(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  build: { rollupOptions: { input: { main: 'index.html', stats: 'stats.html', statsPanel: 'stats-panel.html' } }, outDir: 'dist-pages', emptyOutDir: true },
});
