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
