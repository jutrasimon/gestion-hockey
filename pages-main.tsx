import { createRoot } from 'react-dom/client';
import App from './app/page';
import './app/globals.css';
import derived from './app/palette.json';
import masters from './app/palette-masters.json';

// Same initial palette and saved preferences as the original Sites layout.
const paletteStyle = document.createElement('style');
paletteStyle.textContent = `:root{${[...masters, ...derived].map(p => `--palette-${p.key}:${p.value}`).join(';')}}`;
document.head.appendChild(paletteStyle);
try {
  const theme = localStorage.getItem('hockey-theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  const colors = JSON.parse(localStorage.getItem('hockey-palette-v2') || '{}');
  for (const { key } of masters) {
    if (/^#[0-9a-f]{6}$/i.test(colors[key] || '')) {
      document.documentElement.style.setProperty(`--palette-${key}`, colors[key]);
    }
  }
} catch { /* A browser may disable local storage. */ }
createRoot(document.getElementById('root')!).render(<App />);
