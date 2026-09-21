(function(root){
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),round=n=>Math.round(n*100)/100;
  function contract(salary,years,bonus){
    salary=clamp(Number(salary)||0,2,6);years=clamp(Math.round(Number(years)||1),1,5);bonus=[0,.1,.25].includes(bonus)?bonus:0;
    const parts={base:45,salary:(salary-4.4)*35,security:(years-2)*6,upfront:bonus*20};
    const score=clamp(Math.round(Object.values(parts).reduce((a,b)=>a+b,0)),0,100);
    const counterSalary=Math.max(salary,Math.ceil((4.4+(70-parts.base-parts.security-parts.upfront)/35)*10)/10);
    return {salary,years,bonus,parts,score,accepted:score>=70,counter:round(counterSalary),upfront:Math.round(salary*bonus*1000)/1000,firstYearRemaining:Math.round(salary*(1-bonus)*1000)/1000,total:round(salary*years)};
  }
  const offers={public:{name:'Dossier public',cost:0,gain:0},standard:{name:'Visite ciblée',cost:15000,gain:15},deep:{name:'Observation approfondie',cost:30000,gain:30}};
  const scoutPlayers={prospect:{name:'Mathis Tremblay',visibility:40,stats:[7,9,6,8,5,7,6],traits:['Ambitieux','Réceptif aux conseils'],health:'Ancienne entorse · surveillance conseillée'},star:{name:'Viktor Sokolov',visibility:88,stats:[10,12,8,7,10,11,6],traits:['Cupide','Compétitif'],health:'Épaule sensible · contrôle conseillé'}};
  function freshScout(){return {budget:90000,spent:0,reports:[],knowledge:{},visits:{}}}
  function scout(state,playerId,action,offerId){
    const player=scoutPlayers[playerId],offer=offers[offerId];
    if(!player||!offer||!['shot','skating','mind','health'].includes(action))throw Error('Rapport inconnu');
    const key=playerId+':'+action,previous=state.knowledge[key]??player.visibility;
    const reliability=Math.min(95,previous+offer.gain);
    if(offer.cost>state.budget)return {error:'Budget insuffisant. Choisis le dossier public ou recommence le scénario.'};
    if(state.reports.some(r=>r.key===key)&&reliability===previous)return {error:'Ce dossier est déjà à jour. Change de domaine ou de joueur.'};
    const next=structuredClone(state),visit=(next.visits[key]||0)+(offer.cost?1:0);
    next.visits[key]=visit;next.budget-=offer.cost;next.spent+=offer.cost;next.knowledge[key]=reliability;
    const indexes=action==='shot'?[1,0]:[3,2],radius=reliability>=85?1:reliability>=65?2:3;
    let findings;
    if(action==='shot'||action==='skating')findings=indexes.map(i=>({attribute:i,min:Math.max(1,player.stats[i]-radius),max:Math.min(15,player.stats[i]+radius)}));
    else if(action==='mind')findings=offer.cost?player.traits.slice(0,visit>=2||reliability>=85?2:1):['Personnalité non confirmée par une rencontre'];
    else findings=offer.cost?[player.health]:['Aucun examen privé dans le dossier public'];
    const report={key,playerId,action,offerId,reliability,previous,cost:offer.cost,findings};next.reports.push(report);return {state:next,report};
  }
  const pool=[{id:'bouchard',name:'Camille Bouchard',league:'Ligue Boréale',position:'AG',gp:24,goals:7,assists:6,need:'Centre'},{id:'petrov',name:'Luka Petrov',league:'Ligue Boréale',position:'AD',gp:24,goals:21,assists:17,need:'Ailier'},{id:'beaulieu',name:'Laurence Beaulieu',league:'Ligue Horizon',position:'AG',gp:24,goals:5,assists:9,need:'Centre'}];
  function resolvePool(targetId,offerId){
    const target=pool.find(p=>p.id===targetId);if(!target)throw Error('Cible inconnue');
    const offer=offerId==='gagnon'?{name:'Alexis Gagnon',position:'Centre',value:78}:{name:'Hugo Leclerc',position:'Centre',value:68};
    // Immutable sealed offers are scored together. No first-click advantage.
    const bids=[{id:'you',club:'Québec',league:'Ligue Laurentienne',name:offer.name,score:offer.value+(target.need===offer.position?12:0)},
      {id:'rival',club:'Club des Érables',league:'Ligue des Rives',name:'Centre de démonstration',score:84},
      {id:'internal',club:'Club voisin',league:target.league,name:'Vedette locale',score:99}];
    const valid=bids.filter(b=>b.league!==target.league).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
    return {target,bids,winner:valid[0],accepted:valid[0].id==='you'};
  }
  root.ManagementModels={contract,offers,scoutPlayers,freshScout,scout,pool,resolvePool};
})(globalThis);
