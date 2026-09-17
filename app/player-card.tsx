"use client";
import {useState,type ReactNode} from 'react';
import {motion} from 'motion/react';
import {RotateCw,ArrowUpRight,ShieldCheck,ShieldAlert} from 'lucide-react';
import {FavoriteButton} from './preferences';
import {labels,money,type Player} from './players';
import {clubOf,teams,sourceOf,recordFor,initialScope} from './league';

const portraits:Record<string,number>={roy:0,gagnon:7,sokolov:3,fortin:4,leclerc:1,morin:5};
export function PlayerAvatar({p,className=''}:{p:Player;className?:string}){
 const index=portraits[sourceOf(p.id)]??0;
 return <span className={`player-avatar ${className}`} aria-hidden="true"><img src="/avatars/roster-retro.png" alt="" draggable={false} style={{left:`${-([38,400,762,1124][index%4]/336)*100}%`,top:`${-(index<4?20:429)/350*100}%`}}/></span>;
}
export function healthOf(p:Player){return p.id==='sokolov'?{injured:true,label:'Blessé · 2 sem.',history:'2028–2029 · Aine · En récupération. 2027–2028 · Aine · 3 semaines. 2024–2025 · Poignet · 7 semaines.'}:{injured:false,label:'En santé',history:p.id==='gagnon'?'2026–2027 · Entorse du genou · 5 semaines · Guérie.':'Aucune blessure enregistrée.'}}
export function PlayerCard({p,selected,onSelect,handle,ghost=false}:{p:Player;selected?:boolean;onSelect?:()=>void;handle?:ReactNode;ghost?:boolean}){
 const [flipped,setFlipped]=useState(false);const club=teams.find(t=>t.id===clubOf(p.id))!;const health=healthOf(p);const production=recordFor(p,initialScope.season,initialScope.phase)!;
 return <article className={`player-card roster-card ${p.color} ${selected?'chosen':''} ${ghost?'ghost':''}`} aria-label={`Carte de ${p.name}`}>
 {handle}<div className="roster-toolbar"><span>#{p.num} <span>· {flipped?'PARCOURS':'2028–29'}</span></span>{!ghost&&<FavoriteButton id={p.id} name={p.name}/>}</div>
 <motion.div className="roster-content" key={`${p.id}-${flipped}`} initial={{opacity:.4,rotateY:-12}} animate={{opacity:1,rotateY:0}} transition={{duration:.22}}>
 <button className="roster-identity" onClick={onSelect} aria-label={`Ouvrir la fiche de ${p.name}`}><PlayerAvatar p={p}/><span className="roster-name"><span>{p.name.split(' ')[0]}</span><strong>{p.name.split(' ').slice(1).join(' ')}</strong><span className="roster-position">{p.pos} <i>·</i> {p.age} ans</span></span></button>
 <div className="roster-club"><span className="club-monogram" aria-hidden="true">{club.name.slice(0,1)}</span><span>{club.name}<small>{p.type}</small></span></div>
 <div className="roster-sides"><div className="roster-front" aria-hidden={flipped} style={{visibility:flipped?'hidden':'visible'}}><div className="roster-production" aria-label="Statistiques de saison régulière">{[['MJ',production.gp],['B',production.goals],['A',production.assists],['PTS',production.goals+production.assists]].map(([l,v])=><div key={l}><span>{l}</span><strong>{v}</strong></div>)}</div><div className="roster-attributes">{p.stats.map((v,i)=><div key={labels[i]} title={labels[i]}><span>{['MAN','TIR','PUI','PAT','IQ','CRÉ','CŒ'][i]}</span><strong>{v}</strong></div>)}</div></div><div className="roster-back" aria-hidden={!flipped} style={{visibility:flipped?'visible':'hidden'}}><h3>Développement</h3><dl><div><dt>Potentiel</dt><dd>{p.potential}</dd></div><div><dt>Dans la ligue</dt><dd>{p.league} saisons</dd></div><div><dt>Au club</dt><dd>{p.team} saisons</dd></div><div><dt>Caractère</dt><dd>{p.trait}</dd></div></dl><h3>Santé</h3><p>{health.history}</p></div></div>
 <div className="roster-summary"><div className="roster-contract"><strong>{money(p.salary)}</strong><span> / an · {p.years} ans</span></div><div className={`roster-health ${health.injured?'injured':''}`}>{health.injured?<ShieldAlert size={14}/>:<ShieldCheck size={14}/>} {health.label}</div></div>
 </motion.div><div className="roster-actions"><button onClick={onSelect} aria-label={`Fiche complète de ${p.name}`}>Fiche <ArrowUpRight size={15}/></button><button onClick={()=>setFlipped(v=>!v)} aria-pressed={flipped} aria-label={`Retourner la carte de ${p.name}`}><RotateCw size={16}/>{flipped?'Recto':'Verso'}</button></div>
 </article>
}
