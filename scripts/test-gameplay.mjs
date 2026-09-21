import assert from 'node:assert/strict';
import '../public/gameplay-models.js';
const M=globalThis.GameplayModels;
const constant = x => () => x;
for (const plan of Object.keys(M.plans)) {
  for (const intensity of [0,40,72,100]) {
    for(const r of [0,0.05,0.5,0.999999]) {
      const m=M.match(plan,intensity,constant(r));
      assert.equal(m.goals,m.rolls.filter(x=>x<m.chance).length);
      assert.equal(m.awayGoals,m.awayRolls.filter(x=>x<m.awayChance).length);
      assert.equal(m.turnovers,m.turnoverRolls.filter(x=>x<m.risk).length);
      assert.ok(m.goals<=m.shots && m.awayGoals<=m.against);
    }
  }
}
assert.equal(M.match('balance',72,constant(.5)).fatigue,9);
assert.equal(M.match('balance',100,constant(.5)).fatigue,18);
assert.ok(M.match('attack',72,constant(.5)).shots>M.match('trap',72,constant(.5)).shots);
assert.ok(M.match('attack',72,constant(.5)).risk>M.match('trap',72,constant(.5)).risk);
// Construct a legal zero-intensity win: scoring is not a fixed defeat branch.
const fixture=M.match('balance',0,constant(.5));let draw=0;
const zero=M.match('balance',0,()=>++draw<=21?.5:draw<=21+fixture.shots?0:.999);
assert.ok(zero.goals>zero.awayGoals);
for(const player of ['star','worker','rookie']) {
  assert.equal(M.chemistry(player,Array(7).fill(0)).score,null);
  assert.equal(M.chemistry(player,Array(7).fill(50)).score,M.chemistry(player,Array(7).fill(100)).score);
  const c=M.chemistry(player,[100,0,0,0,0,0,0]);
  assert.equal(c.attributesScore,c.rows[0].contribution/100);
  assert.ok(c.score>=0&&c.score<=100);
}
const start=M.freshTraining();
const first=M.train(start,'skill',1,60,constant(.5));
assert.equal(start.energy,76);assert.equal(start.sessions,0); // pure transition
assert.equal(first.energy,66);
assert.ok(first.stats[1]>start.stats[1]);
assert.deepEqual(first.stats.filter((_,i)=>i!==1),start.stats.filter((_,i)=>i!==1));
const second=M.train(first,'skill',1,60,constant(.5));
assert.ok(second.history[1].gain<first.history[0].gain);
assert.equal(M.rest(second).energy,74);
assert.equal(M.rest(second).sessions,2);
const zeroCharge=M.train(start,'skill',1,0,constant(.5));
assert.deepEqual(zeroCharge.stats,start.stats);assert.equal(zeroCharge.energy,76);assert.equal(zeroCharge.confidence,50);
let state=start;for(let i=0;i<4;i++)state=M.train(state,'skill',1,100,constant(.5));
assert.equal(state.sessions,4);assert.equal(state.history.length,4);
assert.equal(M.train(state,'skill',1,100),null);assert.equal(M.rest(state),null);
const exhausted={...M.freshTraining(),energy:0};assert.equal(M.train(exhausted,'skill',1,100),null);assert.equal(M.rest(exhausted).energy,18);
const capped={...M.freshTraining(),stats:Array(7).fill(15)};assert.equal(M.train(capped,'skill',1,100).stats[1],15);
assert.equal(M.rest({...start,energy:95}).energy,100);
console.log('Gameplay: match accounting, plan effects, zero intensity, chemistry weights, training progression and limits passed.');

await import('../public/gameplay-management-models.js');
const N=globalThis.ManagementModels;
for(const years of [1,2,5])for(const bonus of [0,.1,.25]){
 const offer=N.contract(3.7,years,bonus);
 assert.equal(Math.round((offer.upfront+offer.firstYearRemaining)*100),370);
 assert.equal(offer.total,Math.round(3.7*years*100)/100);
 assert.ok(N.contract(offer.counter,years,bonus).accepted);
}
assert.ok(N.contract(4.5,5,.25).score>N.contract(4.5,2,0).score);
let scouting=N.freshScout();
const free=N.scout(scouting,'star','shot','public');assert.equal(free.report.reliability,88);assert.equal(free.state.budget,90000);
const shot=N.scout(scouting,'prospect','shot','deep');assert.equal(shot.report.reliability,70);assert.equal(shot.state.budget,60000);assert.equal(scouting.reports.length,0);
assert.notDeepEqual(shot.report.findings,N.scout(scouting,'prospect','skating','deep').report.findings);
scouting=N.scout(shot.state,'prospect','shot','deep').state;assert.equal(scouting.knowledge['prospect:shot'],95);
assert.ok(N.scout(scouting,'prospect','shot','deep').error);
assert.ok(N.scout({...scouting,budget:0},'prospect','health','deep').error);
assert.equal(N.scout(N.scout(N.freshScout(),'prospect','mind','standard').state,'prospect','mind','standard').report.findings.length,2);
for(const target of N.pool){const result=N.resolvePool(target.id,'gagnon');assert.notEqual(result.winner.league,target.league);assert.notEqual(result.winner.id,'internal')}
assert.ok(N.resolvePool('bouchard','gagnon').accepted);assert.ok(!N.resolvePool('bouchard','leclerc').accepted);
console.log('Management: contract accounting/counteroffers, scouting budgets/reveals/caps, inter-league exclusion and arbitration passed.');

assert.equal(N.contract(4.5,2,0).score,49);
assert.equal(N.contract(4.5,5,.25).score,72);

// Defense must improve recovery without masquerading as offensive creativity.
const lowDefense=[6,5,6,5,7,2,7],highDefense=[...lowDefense];highDefense[5]=12;
assert.equal(M.simpleRoles(lowDefense)[0],M.simpleRoles(highDefense)[0]);
assert.equal(M.simpleRoles(lowDefense)[1],M.simpleRoles(highDefense)[1]);
assert.ok(M.simpleRoles(highDefense)[2]>M.simpleRoles(lowDefense)[2]);
const defenseTraining=M.train(M.freshTraining(),'skill',5,65,constant(.5));
assert.ok(defenseTraining.stats[5]>M.freshTraining().stats[5]);
assert.deepEqual(defenseTraining.stats.filter((_,i)=>i!==5),M.freshTraining().stats.filter((_,i)=>i!==5));
assert.deepEqual(N.scout(N.freshScout(),'star','defense','deep').report.findings.map(x=>x.attribute),[5,4]);
assert.deepEqual(N.scoutPlayers.star.stats,M.players.star.stats);
const {readFileSync}=await import('node:fs');
const uiSource=readFileSync(new URL('../app/players.ts',import.meta.url),'utf8');
for(const [id,alias] of [['roy','rookie'],['gagnon','gagnon'],['sokolov','star'],['fortin','fortin'],['morin','worker']]){
 const row=uiSource.split('\n').find(line=>line.includes("id:'"+id+"'"));
 const stats=JSON.parse(row.match(/stats:(\[[^\]]+\])/)[1]);
 assert.deepEqual(stats,M.players[alias].stats,`${id}: UI and gameplay stats must agree`);
 assert.equal(row.match(/playStyle:'([^']+)'/)[1],M.players[alias].playStyle);
}
assert.deepEqual(M.freshTraining().stats,M.players.rookie.stats);
assert.equal(M.attributes[5],'Défense');
console.log('Defense: recovery influence, targeted training, scouting and cross-gym roster consistency passed.');
