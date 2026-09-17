"use client";
import {useEffect,useRef,useState} from 'react';
import {motion,useReducedMotion} from 'motion/react';
import {Sparkles,Zap,Trophy,HandFist,RotateCcw,ArrowUpRight} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Slider} from '@/components/ui/slider';
import {PlayerAvatar} from './player-card';
import {seed} from './players';

function ParticleBurst({trigger,power,reduced}:{trigger:number;power:number;reduced:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const el=canvas.current;if(!el||!trigger||reduced)return;
  const ctx=el.getContext('2d');if(!ctx)return;
  const {width:w,height:h}=el.getBoundingClientRect();const dpr=Math.min(window.devicePixelRatio||1,2);
  el.width=w*dpr;el.height=h*dpr;ctx.scale(dpr,dpr);
  const colors=['#b8ed95','#8ccdeb','#e6b3df','#f9c783','#fff8d7'];
  const pieces=Array.from({length:Math.round(28+power*.85)},(_,i)=>{const a=Math.random()*Math.PI*2,v=(65+Math.random()*210)*(.55+power/100);return{x:w/2,y:h*.45,vx:Math.cos(a)*v,vy:Math.sin(a)*v-90,size:3+Math.random()*5,color:colors[i%colors.length],spin:Math.random()*8}});
  let frame=0;const start=performance.now();
  function draw(now:number){const t=(now-start)/1000;ctx!.clearRect(0,0,w,h);if(t>1.6)return;ctx!.globalAlpha=Math.min(1,(1.6-t)*2);for(const p of pieces){ctx!.save();ctx!.translate(p.x+p.vx*t,p.y+p.vy*t+135*t*t);ctx!.rotate(p.spin*t);ctx!.fillStyle=p.color;ctx!.fillRect(-p.size/2,-p.size/2,p.size,p.size*.65);ctx!.restore()}frame=requestAnimationFrame(draw)}
  frame=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(frame);ctx.clearRect(0,0,w,h)};
 },[trigger,power,reduced]);
 return <canvas className="juice-particles" ref={canvas} aria-hidden="true"/>;
}
export function JuiceLab(){
 const reduced=!!useReducedMotion();const [power,setPower]=useState(65);const [burst,setBurst]=useState(0);const [mode,setMode]=useState<'burst'|'impact'|'reward'|'punch'>('burst');const [open,setOpen]=useState(false);
 function fire(kind:'burst'|'impact'|'reward'|'punch'){setMode(kind);setBurst(n=>n+1);if(kind==='reward')setOpen(true)}
 return <section className="juice-lab"><div className="juice-heading"><div><span className="eyebrow">LE LABO DES SENSATIONS</span><h2>Ça doit se sentir.</h2></div><span className="juice-label">TEST LIBRE</span></div>
 <motion.div className={`juice-stage juice-stage-${mode}`} key={`stage-${burst}`} initial={false} animate={!reduced&&burst&&mode==='punch'?{x:[0,0,-power*.22,power*.18,-power*.12,power*.07,0],y:[0,0,5,-4,2,-1,0],scale:[1,.97,1.035,1.035,1.01,.995,1]}:!reduced&&burst&&mode==='impact'?{x:[0,-power*.16,power*.12,-power*.08,power*.04,0],y:[0,3,-2,0]}:{}} transition={{type:'tween',duration:mode==='punch'?.6:.32,times:mode==='punch'?[0,.2,.26,.34,.48,.68,1]:undefined}}><div className="juice-stage-grid" aria-hidden="true"/>
 <motion.div className="juice-emblem" key={`emblem-${burst}`} initial={false} animate={reduced?{}:mode==='punch'&&burst?{scale:[1,1-power*.004,1+power*.008,1+power*.008,.92,1.04,1],rotate:[0,-5,6,6,-3,1,0]}:mode==='impact'&&burst?{scaleX:[1,1.22,.94,1],scaleY:[1,.76,1.06,1],rotate:[0,-7,3,0]}:burst?{scale:[1,.9,1.12,1],rotate:[0,-5,5,0]}:{}} transition={{type:'tween',duration:mode==='punch'?.7:.48,times:mode==='punch'?[0,.2,.26,.34,.55,.78,1]:undefined}}><span className="juice-emblem-number">H.</span><span>CLUB LAB</span></motion.div>
 {burst>0&&!reduced&&mode==='impact'&&<>
 <motion.div className="juice-impact-flash" initial={{opacity:.25+power/200}} animate={{opacity:0}} transition={{type:'tween',duration:.18}}/>
 <motion.div className="juice-impact-slash" initial={{scaleX:.1,opacity:1}} animate={{scaleX:1+power/100,opacity:0}} transition={{type:'tween',duration:.35}}/>
 <motion.div className="juice-shockwave" initial={{scale:.4,opacity:1}} animate={{scale:2+power/60,opacity:0}} transition={{type:'tween',duration:.42}}/>
 </>}
 {burst>0&&!reduced&&mode==='punch'&&<motion.div className="juice-punch-ring" initial={{scale:.3,opacity:0}} animate={{scale:[.3,.3,1.8,2.5],opacity:[0,0,.8,0]}} transition={{type:'tween',duration:.65,times:[0,.2,.35,1]}}/>}
 {mode==='burst'&&<ParticleBurst trigger={burst} power={power} reduced={reduced}/>}
 <motion.div key={`caption-${burst}`} className="juice-result" initial={reduced?false:{y:10,opacity:0}} animate={{y:0,opacity:1}} role="status">{burst===0?'Prêt pour le prochain gros moment.':mode==='punch'?'PUNCH !':mode==='impact'?'IMPACT !':mode==='reward'?'NOUVEAU PALIER !':'ÇA EXPLOSE !'}</motion.div>
 <span className="juice-stage-note">{reduced?'Mouvements réduits activés sur cet appareil.':'Déclenche un effet, puis ajuste son intensité.'}</span>
 </motion.div>
 <div className="juice-triggers juice-four-effects"><motion.button whileTap={reduced?undefined:{scale:.95}} onClick={()=>fire('burst')}><Sparkles size={22}/><strong>Explosion</strong><small>Une pluie de particules</small></motion.button><motion.button whileTap={reduced?undefined:{scale:.95}} onClick={()=>fire('impact')}><Zap size={22}/><strong>Impact</strong><small>Coup sec, flash et secousse</small></motion.button><motion.button whileTap={reduced?undefined:{scale:.95}} onClick={()=>fire('punch')}><HandFist size={22}/><strong>Punch</strong><small>Anticipation, zoom et secousse</small></motion.button><motion.button whileTap={reduced?undefined:{scale:.95}} onClick={()=>fire('reward')}><Trophy size={22}/><strong>Récompense</strong><small>Le grand reveal</small></motion.button></div>
 <div className="juice-controls"><label id="juice-power">Intensité <b>{power}%</b></label><Slider aria-labelledby="juice-power" value={[power]} onValueChange={v=>setPower(v[0])} min={0} max={100} step={5}/><button onClick={()=>{setPower(65);setBurst(0);setMode('burst')}} aria-label="Réinitialiser les effets"><RotateCcw size={18}/></button></div>
 <Dialog open={open} onOpenChange={setOpen}><DialogContent className="juice-reward"><ParticleBurst trigger={burst} power={power} reduced={reduced}/><span className="eyebrow">DÉMO · PROGRESSION</span><motion.div className="reward-player" initial={reduced?false:{scale:.6,rotate:-8,opacity:0}} animate={{scale:1,rotate:0,opacity:1}} transition={{type:'spring',stiffness:220,damping:16}}><PlayerAvatar p={seed[0]}/><span className="reward-trophy"><Trophy size={24}/></span></motion.div><DialogTitle>Un cap de franchi.</DialogTitle><DialogDescription>Émilie Roy · aperçu d’une récompense de développement.</DialogDescription><div className="reward-stat"><span>PATINAGE</span><strong>7 <ArrowUpRight size={26}/> <b>8</b></strong></div><p className="reward-note">Effet de démonstration : les attributs du joueur ne sont pas modifiés.</p><button className="reward-continue" onClick={()=>setOpen(false)}>C’est parti <ArrowUpRight size={18}/></button></DialogContent></Dialog>
 </section>
}
