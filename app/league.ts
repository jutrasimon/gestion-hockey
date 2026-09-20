import {seed,type Player} from './players';
export const teams=[{id:'quebec',name:'Québec'},{id:'montreal',name:'Montréal'},{id:'sherbrooke',name:'Sherbrooke'}];
const names=[['Camille Bouchard','Mathis Dubois','Luka Petrov','Florence Moreau','Gabriel Tremblay','Elliot Simard'],['Laurence Beaulieu','Samuel Pelletier','Nikita Orlov','Chloé Côté','Charles Gauthier','Olivier Bergeron']];
export const roster:Player[]= [...seed,...names.flatMap((group,t)=>group.map((name,i)=>({...seed[i],id:`${teams[t+1].id}-${i}`,name,num:11+i*9+t,age:seed[i].age+1,league:seed[i].league+1,team:1,goals:seed[i].goals+(t?2:4)-(i%2),assists:seed[i].assists+(t?5:2),salary:Number((seed[i].salary*(t?0.9:1.1)).toFixed(2)),stats:seed[i].stats.map((v,j)=>Math.max(1,v+((i+j+t)%3)-1))})))];
export const clubOf=(id:string)=>id.startsWith('montreal-')?'montreal':id.startsWith('sherbrooke-')?'sherbrooke':'quebec';
export const sourceOf=(id:string)=>seed.some(p=>p.id===id)?id:seed[Number(id.split('-').at(-1))].id;
export type Scope={team:string;season:string;phase:string};
export const initialScope:Scope={team:'quebec',season:'2028-2029',phase:'regular'};
export type SeasonPlayer=Player&{gp:number;club:string;season:string;phase:string};
export function hasPlayoffs(season:string,team:string){return season==='2027-2028'&&team!=='sherbrooke';}
export function recordFor(player:Player,season:string,phase:string):SeasonPlayer|null{
 const club=clubOf(player.id);if(phase==='playoffs'&&!hasPlayoffs(season,club))return null;
 if(season==='2027-2028'&&player.league===1)return null;
 const historical=season==='2027-2028',gp=phase==='playoffs'?(club==='quebec'?12:7):historical?82:24;
 const index=roster.findIndex(p=>p.id===player.id);
 const factor=gp/24*(historical?0.72+(index%4)*0.1:1);
 return {...player,gp,club,season,phase,goals:Math.round(player.goals*factor),assists:Math.round(player.assists*factor),age:player.age-(historical?1:0)};
}
export function scopedRows(players:Player[],scope:Scope,favorites:string[]=[],onlyFavorites=false){return players.map(p=>recordFor(p,scope.season,scope.phase)).filter((p):p is SeasonPlayer=>!!p&&(scope.team==='league'||p.club===scope.team)&&(!onlyFavorites||favorites.includes(p.id)));}
