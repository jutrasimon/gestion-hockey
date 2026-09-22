import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync('app/match-sim-model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {createMatch,stepMatch,resumeGoal,effective,heartEffects,syncHeart,tryCheck,RINK,chooseAction,intentions,laneSpace}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const p={name:'Test',num:14,stats:[7,9,8,9,7,7],style:1,energy:100,morale:100,confidence:0,weight:190,height:72};
const roster=Array.from({length:6},(_,i)=>({...p,name:'Joueur '+i,style:i%3}));
assert.ok(Math.abs(effective({...p,energy:50,morale:50,confidence:100})[0]-7*(.5+.5*.3*7/15)**2*1.25)<1e-10);
function play(seed){const s=createMatch(roster,seed);for(let i=0;i<1000&&!s.ended;i++){if(s.goalPause){const time=s.time;stepMatch(s);assert.equal(s.time,time);resumeGoal(s);}stepMatch(s);assert.ok(s.agents.every(p=>[p.x,p.y,p.energy].every(Number.isFinite)&&p.x>=3&&p.x<=97&&p.y>=3&&p.y<=47));}assert.equal(s.time,20);assert.ok(s.ended);return s;}
assert.deepEqual(play(42),play(42));
let goals=0,shots=0,passes=0;
for(let seed=1;seed<=100;seed++){const s=play(seed);goals+=s.score[0]+s.score[1];shots+=s.shots[0]+s.shots[1];passes+=s.events.filter(e=>e.text.startsWith('Passe reçue')).length;for(let t=0;t<2;t++){const ps=s.playerStats.slice(t*3,t*3+3);for(const key of ['goals','shots','blocks','losses'])assert.equal(ps.reduce((n,p)=>n+p[key],0),s[key==='goals'?'score':key==='losses'?'turnovers':key][t]);assert.ok(ps.every(p=>p.completed<=p.passes&&p.onTarget<=p.shots&&p.goals<=p.onTarget));assert.ok(ps.reduce((n,p)=>n+p.assists,0)<=s.score[t]);const pending=s.flight?.kind==='shot'&&s.agents[s.flight.from].team===t?1:0;assert.equal(s.shots[t],s.score[t]+s.saves[1-t]+s.blocks[1-t]+s.misses[t]+pending);}}
assert.ok(goals>0&&shots>goals&&passes>0);
const stopped=createMatch(roster.map(p=>({...p,energy:0})));const before=stopped.agents.map(p=>[p.x,p.y]);stepMatch(stopped);assert.deepEqual(stopped.agents.map(p=>[p.x,p.y]),before);
console.log(`Match 3v3: 100 periods complete, deterministic replay, goal pauses, shot accounting, context and rink bounds passed. ${goals} goals, ${shots} attempts, ${passes} completed passes.`);

// Tactical regressions: an isolated carrier keeps a breakaway instead of rolling a pass.
const situation=createMatch(roster,42);
situation.owner=0;
function place(points){points.forEach(([x,y],i)=>Object.assign(situation.agents[i],{x,y}));}
place([[70,25],[86,10],[55,40],[40,10],[40,25],[40,40]]);
assert.equal(chooseAction(situation).kind,'carry');
situation.agents[0].x=85;assert.equal(chooseAction(situation).kind,'shot');
// Under pressure, a free teammate receives the puck. The same lane gets rejected when covered.
place([[60,25],[78,38],[40,10],[62,25],[45,5],[40,45]]);
assert.equal(chooseAction(situation).kind,'pass');assert.equal(chooseAction(situation).to,1);
Object.assign(situation.agents[4],{x:70,y:32});assert.notEqual(chooseAction(situation).to,1);
assert.ok(laneSpace({x:60,y:25},{x:78,y:38},[{x:70,y:32}])<3);
// Distinct support lanes create width; only one defender pressures the carrier.
place([[60,25],[45,25],[40,25],[70,12],[70,25],[70,38]]);
const plan=intentions(situation);
assert.ok(Math.abs(plan[1].target.y-plan[2].target.y)>10);
assert.equal(plan.filter(p=>p.label==='Contenir le porteur').length,1);
assert.equal(plan.filter(p=>p.label.startsWith('Couvrir ')).length,2);
// The receiver holds position during a pass. Teammates maintain structure, not a puck chase.
situation.owner=-1;situation.flight={kind:'pass',from:0,to:1,x:45,y:25,quality:0};
const passing=intentions(situation);assert.deepEqual(passing[1].target,{x:45,y:25});assert.equal(passing[1].label,'Recevoir la passe');
situation.flight=null;const loosePlan=intentions(situation);assert.equal(loosePlan.filter(p=>p.label==='Récupérer la rondelle').length,2);
console.log('Tactics: breakaway preserved, open receiver selected, covered pass rejected, lateral support, individual coverage and pass-flight formation passed.');

const assistMatch=createMatch(roster,42);assistMatch.lastPasser=1;assistMatch.owner=-1;assistMatch.puck={x:97,y:25};assistMatch.flight={kind:'shot',from:0,to:-1,x:97,y:25,quality:1};stepMatch(assistMatch);assert.equal(assistMatch.playerStats[0].goals,1);assert.equal(assistMatch.playerStats[1].assists,1);resumeGoal(assistMatch);assert.equal(assistMatch.lastPasser,-1);assert.ok(createMatch(roster).playerStats.every(p=>Object.values(p).every(v=>v===0)));
console.log('Individual counters: team totals, completed/attempted passes, shots, primary assist and fresh-period reset passed.');

const heartPlayer={...p,stats:[7,9,8,9,7,15],energy:40,morale:40};const effects=heartEffects(heartPlayer);assert.ok(Math.abs(effects.energy-.58)<1e-10);assert.ok(Math.abs(effects.morale-.58)<1e-10);assert.equal(heartPlayer.energy,40);
const emotional=createMatch(Array.from({length:6},()=>({...heartPlayer,energy:100,morale:100})));emotional.score=[0,1];emotional.agents[0].emotion='Réaction au placage';emotional.agents[0].emotionUntil=2;syncHeart(emotional);assert.equal(emotional.agents[0].heartBoost,.15);emotional.time=2;syncHeart(emotional);assert.equal(emotional.agents[0].heartBoost,.1);assert.equal(emotional.agents[0].emotion,'');emotional.score=[1,1];syncHeart(emotional);assert.equal(emotional.agents[0].heartBoost,0);
const contact=createMatch(roster);contact.owner=0;Object.assign(contact.agents[0],{x:50,y:25});Object.assign(contact.agents[3],{x:48,y:25});assert.ok(tryCheck(contact,3,0,()=>0));assert.equal(contact.playerStats[3].hits,1);assert.equal(contact.playerStats[0].hitsReceived,1);assert.equal(contact.agents[0].energy,98);assert.equal(contact.agents[3].energy,99);assert.equal(contact.owner,-1);assert.ok(contact.contacts.length===1&&contact.agents[0].x>50);assert.equal(contact.agents[0].emotion,'Réaction au placage');assert.equal(tryCheck(contact,3,0,()=>0),false);
const avoided=createMatch(roster);avoided.owner=0;Object.assign(avoided.agents[0],{x:50,y:25});Object.assign(avoided.agents[3],{x:48,y:25});assert.equal(tryCheck(avoided,3,0,()=>.999),false);assert.equal(avoided.playerStats[3].hits,0);
// A goal triggers conceding emotions; an equalizer also mobilizes the scoring team.
const equalizer=createMatch(roster);equalizer.score=[0,1];equalizer.owner=-1;equalizer.puck={x:97,y:25};equalizer.flight={kind:'shot',from:0,to:-1,x:97,y:25,quality:1};stepMatch(equalizer);assert.equal(equalizer.agents[0].emotion,'But égalisateur');assert.equal(equalizer.agents[3].emotion,'But encaissé');const until=equalizer.agents[0].emotionUntil;stepMatch(equalizer);assert.equal(equalizer.agents[0].emotionUntil,until);
assert.deepEqual([RINK.width,RINK.height],[70,35]);
for(let seed=1;seed<=30;seed++){const s=play(seed);assert.equal(s.playerStats.reduce((n,p)=>n+p.hits,0),s.playerStats.reduce((n,p)=>n+p.hitsReceived,0));assert.ok(s.agents.every(p=>p.heartBoost<=.15&&p.energy>=0));}
console.log('Mini hockey: heart resilience, comeback/emotion caps and expiry, goal emotions, contact recoil/costs/cooldowns, hits given/received accounting passed.');
