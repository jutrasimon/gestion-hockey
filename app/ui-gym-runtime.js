// Shared UI Gym preferences, including static pages and embedded stats panels.
(function(){
const keys=PALETTE_KEYS;
function sync(){try{const theme=localStorage.getItem('hockey-theme')||'dark';document.documentElement.dataset.theme=theme;document.body?.classList.toggle('light',theme==='light');const colors=JSON.parse(localStorage.getItem('hockey-palette-v2')||'{}');for(const key of keys){const value=colors[key];if(/^#[\da-f]{6}$/i.test(value||''))document.documentElement.style.setProperty('--palette-'+key,value);else document.documentElement.style.removeProperty('--palette-'+key)}}catch{}}
window.addEventListener('storage',sync);window.addEventListener('hockey-appearance',sync);document.addEventListener('DOMContentLoaded',sync);sync();
})();
