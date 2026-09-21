(function(root){
const M=root.GameplayModels,round=n=>Math.round(n*100)/100;
const plans={trap:{name:'Prudent',shots:-4,against:-4,fatigue:4},balance:{name:'Équilibré',shots:0,against:0,fatigue:8},attack:{name:'Offensif',shots:6,against:4,fatigue:12}};
function previewMatch(id){const p=plans[id];if(!p)throw Error('Plan inconnu');return {planId:id,shots:20+p.shots,against:22+p.against,fatigue:p.fatigue};}
function match(id,rng=Math.random){const r=previewMatch(id),rolls=Array.from({length:r.shots},()=>1+Math.floor(rng()*10)),awayRolls=Array.from({length:r.against},()=>1+Math.floor(rng()*10));return {...r,rolls,awayRolls,goals:rolls.filter(n=>n===1).length,awayGoals:awayRolls.filter(n=>n===1).length};}
function trio(id){if(!['star','worker','rookie'].includes(id))throw Error('Ailier inconnu');const team=[M.players.gagnon,M.players.fortin,M.players[id]];return {team,creation:team.reduce((s,p)=>s+p.stats[4],0)/3,finishing:Math.max(...team.map(p=>p.stats[1])),defense:team.reduce((s,p)=>s+p.stats[5],0)/3};}
const loads={light:{name:'Légère',gain:.25,cost:5},normal:{name:'Normale',gain:.5,cost:10},intense:{name:'Intense',gain:1,cost:20}};
const fresh=()=>({sessions:0,day:0,energy:76,stats:[...M.players.rookie.stats],history:[]});
function previewTraining(state,id,target){const p=loads[id];if(!p||!Number.isInteger(target)||target<0||target>6)throw Error('Séance inconnue');const multiplier=state.energy<40?.5:1;return {base:p.gain,multiplier,gain:round(Math.min(15-state.stats[target],p.gain*multiplier)),cost:p.cost,allowed:state.sessions<4&&state.energy>=p.cost};}
function train(state,id,target){const p=previewTraining(state,id,target);if(!p.allowed)return null;const next=structuredClone(state);next.sessions++;next.day++;next.energy-=p.cost;next.stats[target]=round(next.stats[target]+p.gain);next.history.push({type:'training',target,load:id,...p,before:state.stats[target],after:next.stats[target],energyBefore:state.energy,energyAfter:next.energy});return next;}
function rest(state){if(state.sessions>=4||state.energy>=100)return null;const next=structuredClone(state);next.day++;next.energy=Math.min(100,state.energy+20);next.history.push({type:'rest',energyBefore:state.energy,energyAfter:next.energy});return next;}
root.SimpleModels={plans,previewMatch,match,trio,loads,fresh,previewTraining,train,rest};
})(globalThis);
