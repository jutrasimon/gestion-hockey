import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const masters=JSON.parse(fs.readFileSync('app/palette-masters.json','utf8'));
const events={},style=new Map(),stored=new Map([['hockey-theme','light'],['hockey-palette-v2',JSON.stringify({'master-blue':'#123456','stat-high':'unsafe'})]]);
const root={dataset:{},style:{setProperty:(k,v)=>style.set(k,v),removeProperty:k=>style.delete(k)}};
const body={classList:{toggle:(k,v)=>body[k]=v}};
const context={document:{documentElement:root,body,addEventListener:(k,fn)=>events[k]=fn},window:{addEventListener:(k,fn)=>events[k]=fn},localStorage:{getItem:k=>stored.get(k)}};
vm.runInNewContext(fs.readFileSync('app/ui-gym-runtime.js','utf8').replace('PALETTE_KEYS',JSON.stringify(masters.map(p=>p.key))),context);
assert.equal(root.dataset.theme,'light');assert.equal(body.light,true);assert.equal(style.get('--palette-master-blue'),'#123456');assert.equal(style.has('--palette-stat-high'),false);
stored.set('hockey-theme','dark');stored.set('hockey-palette-v2','{}');events.storage();assert.equal(body.light,false);assert.equal(root.dataset.theme,'dark');assert.equal(style.size,0);
for(const page of ['index.html','stats.html','stats-panel.html','gameplay.html']){const html=fs.readFileSync('dist-pages/'+page,'utf8');assert.ok(html.includes('ui-gym-shared.css'),page);assert.ok(html.includes('ui-gym-shared.js'),page);}
console.log('Shared UI: every page wired; palette validation/reset and cross-page theme synchronization passed.');
