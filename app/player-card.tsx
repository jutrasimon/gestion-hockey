"use client";
import {useState,type ReactNode} from 'react';
import {motion} from 'motion/react';
import {RotateCw,Maximize2,ShieldCheck,ShieldAlert} from 'lucide-react';
import {FavoriteButton} from './preferences';
import {labels,money,type Player} from './players';
import {clubOf,teams,sourceOf,recordFor,initialScope} from './league';

const portraits:Record<string,number>={roy:0,gagnon:7,sokolov:3,fortin:4,leclerc:1,morin:5};
export function PlayerAvatar({p,className=''}:{p:Player;className?:string}){
 const index=portraits[sourceOf(p.id)]??0;
 // Crop each face around its own center; fixed image coordinates avoid percentage drift.
 const centers=[201,575,940,1308,207,571,940,1307];
 // The second row starts below the printed labels of the first row.
 const height=index<4?374:354;
 const width=height*320/374;
 const x=centers[index]-width/2;const y=index<4?8:422;
 return <span className={`player-avatar ${className}`} aria-hidden="true"><svg viewBox={`${x} ${y} ${width} ${height}`} focusable="false" preserveAspectRatio="xMidYMid meet"><image href="/avatars/roster-retro.png" width="1536" height="1024"/></svg></span>;
}
export function healthOf(p:Player){return p.id==='sokolov'?{injured:true,label:'Blessé · 2 sem.',history:'2028–2029 · Aine · En récupération. 2027–2028 · Aine · 3 semaines. 2024–2025 · Poignet · 7 semaines.'}:{injured:false,label:'En santé',history:p.id==='gagnon'?'2026–2027 · Entorse du genou · 5 semaines · Guérie.':'Aucune blessure enregistrée.'}}
export function PlayerCard({p,selected,onSelect,onOpen,handle,ghost=false,initialFlipped=false,onFlip}:{p:Player;selected?:boolean;onSelect?:()=>void;onOpen?:()=>void;handle?:ReactNode;ghost?:boolean;initialFlipped?:boolean;onFlip?:(value:boolean)=>void}){
 const [flipped,setFlipped]=useState(initialFlipped);const club=teams.find(t=>t.id===clubOf(p.id))!;const health=healthOf(p);const production=recordFor(p,initialScope.season,initialScope.phase)!;
 return <article className={`player-card roster-card compact-roster ${p.color} ${selected?'chosen':''} ${ghost?'ghost':''}`} aria-label={`Carte de ${p.name}`}>
 {handle}<div className="roster-toolbar"><span>{flipped?'PARCOURS':`#${p.num}`} {!flipped&&<span>· 2028–29</span>}</span>{!ghost&&<FavoriteButton id={p.id} name={p.name}/>}</div>
 <motion.div className={`roster-content ${flipped?'show-back':''}`} key={`${p.id}-${flipped}`} initial={ghost?false:{opacity:.4,rotateY:-12}} animate={{opacity:1,rotateY:0}} transition={{duration:.22}}>
 {flipped?<div className="player-dossier">
 <h3>{p.name}</h3>
 <div className="dossier-potential"><span>Potentiel</span><strong>{p.potential}</strong></div>
 <dl><div><dt>Ligue</dt><dd>{p.league} saisons</dd></div><div><dt>Au club</dt><dd>{p.team} saisons</dd></div><div><dt>Trait</dt><dd>{p.trait}</dd></div></dl>
 <div className="dossier-character"><h4>Personnalité</h4>{[['Rebelle','Conformiste'],['Intransigeant','Conciliant']].map((axis,i)=><div className="dossier-axis" key={i}><span>{axis[p.axes[i]>=50?1:0]}</span><div role="img" aria-label={`${axis[0]} à ${axis[1]} : ${p.axes[i]} sur 100`}><i style={{left:`${p.axes[i]}%`}}/></div></div>)}</div>
 <div className="dossier-health"><h4>{health.label}</h4><p title={health.history}>{p.id==='sokolov'?'Aine · En récupération':p.id==='gagnon'?'Genou · 2026–2027 · Guérie':'Aucune blessure enregistrée.'}</p></div>
 </div>:<>
 <button className="roster-identity" onClick={onSelect} aria-label={`Sélectionner ${p.name}`}><PlayerAvatar p={p}/><span className="roster-name"><span>{p.name.split(' ')[0]}</span><strong>{p.name.split(' ').slice(1).join(' ')}</strong><span className="roster-position">{p.pos} <i>·</i> {p.age} ans</span></span></button>
 <div className="roster-club"><span className="club-monogram" aria-hidden="true">{club.name.slice(0,1)}</span><span>{club.name}<small>{p.type}</small></span></div>
 <div className="roster-production" aria-label="Statistiques de saison régulière">{[['MJ',production.gp],['B',production.goals],['A',production.assists],['PTS',production.goals+production.assists]].map(([l,v])=><div key={l}><span>{l}</span><strong>{v}</strong></div>)}</div>
 <div className="roster-attributes">{p.stats.map((v,i)=><div key={labels[i]} title={labels[i]}><span>{['MAN','TIR','PUI','PAT','IQ','CRÉ','CŒ'][i]}</span><strong>{v}</strong></div>)}</div>
 <div className="roster-summary"><div className="roster-contract"><strong>{money(p.salary)}</strong><span> / an · {p.years} ans</span></div></div>
 </>}
 </motion.div><div className="roster-actions"><button className="card-open-full" onClick={onOpen||onSelect} aria-label={`Ouvrir la fiche complète de ${p.name}`} title="Ouvrir la fiche complète"><Maximize2 size={17}/><span>Fiche</span></button><button onClick={()=>{setFlipped(!flipped);onFlip?.(!flipped)}} aria-pressed={flipped} aria-label={`Retourner la carte de ${p.name}`}><RotateCw size={16}/><span>{flipped?'Recto':'Verso'}</span></button></div>
 </article>
}
