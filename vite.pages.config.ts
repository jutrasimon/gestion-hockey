import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Publish the original client UI under GitHub Pages' repository subdirectory.
const base = '/gestion-hockey/';
export default defineConfig({
  base,
  plugins: [
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
  build: { rollupOptions: { input: { main: 'index.html', stats: 'stats.html' } }, outDir: 'dist-pages', emptyOutDir: true },
});
