import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync('app/match-sim-model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {createMatch,stepMatch,resumeGoal,effective}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const p={name:'Test',stats:[7,9,8,9,7,8,7],style:1,energy:100,morale:100,confidence:0,weight:190,height:72};
const roster=Array.from({length:6},(_,i)=>({...p,name:'Joueur '+i,style:i%3}));
assert.equal(effective({...p,energy:50,morale:50,confidence:100})[0],7*.25*1.25);
function play(seed){const s=createMatch(roster,seed);for(let i=0;i<1000&&!s.ended;i++){if(s.goalPause){const time=s.time;stepMatch(s);assert.equal(s.time,time);resumeGoal(s);}stepMatch(s);assert.ok(s.agents.every(p=>[p.x,p.y,p.energy].every(Number.isFinite)&&p.x>=3&&p.x<=97&&p.y>=3&&p.y<=47));}assert.equal(s.time,20);assert.ok(s.ended);return s;}
assert.deepEqual(play(42),play(42));
let goals=0,shots=0,passes=0;
for(let seed=1;seed<=100;seed++){const s=play(seed);goals+=s.score[0]+s.score[1];shots+=s.shots[0]+s.shots[1];passes+=s.events.filter(e=>e.text.startsWith('Passe reçue')).length;for(let t=0;t<2;t++){const pending=s.flight?.kind==='shot'&&s.agents[s.flight.from].team===t?1:0;assert.equal(s.shots[t],s.score[t]+s.saves[1-t]+s.blocks[1-t]+s.misses[t]+pending);}}
assert.ok(goals>0&&shots>goals&&passes>0);
const stopped=createMatch(roster.map(p=>({...p,energy:0})));const before=stopped.agents.map(p=>[p.x,p.y]);stepMatch(stopped);assert.deepEqual(stopped.agents.map(p=>[p.x,p.y]),before);
console.log(`Match 3v3: 100 periods complete, deterministic replay, goal pauses, shot accounting, context and rink bounds passed. ${goals} goals, ${shots} attempts, ${passes} completed passes.`);
