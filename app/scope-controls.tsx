"use client";
import {CalendarDays,Trophy,UsersRound} from 'lucide-react';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {teams,hasPlayoffs,type Scope} from './league';
export function ScopeControls({value,onChange,periodOnly=false}:{value:Scope;onChange:(v:Scope)=>void;periodOnly?:boolean}){
 function field(label:string,key:keyof Scope,options:{id:string;name:string;disabled?:boolean}[]){const Icon=key==='team'?UsersRound:key==='season'?CalendarDays:Trophy;return <div className={`scope-field scope-${key}`}><Select value={value[key]} onValueChange={v=>onChange({...value,[key]:v})}><SelectTrigger aria-label={label} className="scope-trigger"><span className="scope-icon"><Icon size={19}/></span><span className="scope-copy"><span className="scope-label">{label}</span><SelectValue/></span></SelectTrigger><SelectContent className="scope-options" position="popper" sideOffset={8}>{options.map(o=><SelectItem className="scope-option" key={o.id} value={o.id} disabled={o.disabled}>{o.name}</SelectItem>)}</SelectContent></Select></div>}
 return <div className={`scope-controls ${periodOnly?'scope-period':''}`}>{!periodOnly&&field('Équipe / ligue','team',[...teams,{id:'league',name:'Leaders de la ligue'}])}{field('Saison','season',[{id:'2028-2029',name:'2028–2029'},{id:'2027-2028',name:'2027–2028'}])}{field('Compétition','phase',[{id:'regular',name:'Saison régulière'},{id:'playoffs',name:hasPlayoffs(value.season,value.team)?'Séries éliminatoires':'Séries · aucune donnée'}])}</div>
}
