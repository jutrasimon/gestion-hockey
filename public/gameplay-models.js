/* Experimental rules, deliberately exposed to make the gym auditable. */
(function (root) {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const round = v => Math.round(v * 100) / 100;
  const attributes = ['Maniement', 'Tir', 'Puissance', 'Rapidité', 'IQ hockey', 'Cœur'];
  const players = {
    gagnon: {name:'Alexis Gagnon',playStyle:'Prudent', role:'Centre polyvalent', stats:[6,5,6,5,7,7]},
    fortin: {name:'Sarah Fortin',playStyle:'Créatif', role:'Ailière créatrice', stats:[7,4,3,8,6,5]},
    star: {name:'Viktor Sokolov',playStyle:'Créatif', role:'Finisseur exigeant', stats:[10,12,8,7,10,6], fit:72},
    worker: {name:'Jules Morin',playStyle:'Prudent', role:'Soutien polyvalent', stats:[5,5,5,6,6,7], fit:94},
    rookie: {name:'Émilie Roy',playStyle:'Direct', role:'Espoir à adapter à droite', stats:[4,6,3,7,3,7], fit:62},
  };
  const plans = {
    attack:{name:'Attaque totale', shots:6, risk:0.06, against:5},
    balance:{name:'Structure équilibrée', shots:0, risk:0, against:0},
    trap:{name:'Fermer le jeu', shots:-4, risk:-0.04, against:-5},
  };
  const teams = {
    home:{name:'Québec', attack:8.2, defense:8.1, goalie:8.3},
    away:{name:'Montréal', attack:8.8, defense:8.4, goalie:8, roster:[['C','Mathieu Bélanger',9],['AG','Nicolas Dubé',8.5],['AD','Olivier Caron',8.9],['D','Samuel Gervais',8.6],['D','Antoine Perron',8.2],['G','Félix Mercier',8]]},
  };
  function match(planId, intensity, rng = Math.random) {
    const p = plans[planId];
    if (!p) throw Error('Plan inconnu');
    const i = clamp(Number(intensity),0,100), h=teams.home, a=teams.away;
    const volumeRoll = round(rng()*6-3);
    const risk = round(clamp(0.08 + i*0.001 + p.risk,0,1));
    const turnoverRolls = Array.from({length:20},()=>rng());
    const turnovers = turnoverRolls.filter(x=>x<risk).length;
    const shots = Math.max(1,Math.round(18+i*0.12+p.shots+(h.attack-a.defense)*2+volumeRoll));
    const against = Math.max(1,Math.round(27+p.against+(a.attack-h.defense)*2+turnovers*0.5));
    const chance = round(clamp(0.085+(h.attack-a.goalie)*0.008+(i-50)*0.0002,0.03,0.2));
    const awayChance = round(clamp(0.085+(a.attack-h.goalie)*0.008,0.03,0.2));
    const rolls = Array.from({length:shots},()=>rng());
    const awayRolls = Array.from({length:against},()=>rng());
    const goals=rolls.filter(x=>x<chance).length, awayGoals=awayRolls.filter(x=>x<awayChance).length;
    return {planId,intensity:i,volumeRoll,risk,turnoverRolls,turnovers,shots,against,chance,awayChance,rolls,awayRolls,goals,awayGoals,fatigue:Math.round(18*(i/100)**2)};
  }
  function chemistry(candidate, weights) {
    const right=players[candidate];
    if (!right || !('fit' in right)) throw Error('Ailier inconnu');
    const rows=attributes.map((name,j)=>{
      const values=[players.gagnon.stats[j],players.fortin.stats[j],right.stats[j]];
      const weight=clamp(Number(weights[j])||0,0,100);
      const level=values.reduce((a,b)=>a+b,0)/45*100;
      const spread=Math.max(...values)-Math.min(...values);
      const complement=clamp(100-Math.abs(spread-3)*12,0,100);
      return {name,values,weight,level,complement,contribution:(level*0.4+complement*0.6)*weight};
    });
    const total=rows.reduce((s,r)=>s+r.weight,0);
    const attributesScore=total ? rows.reduce((s,r)=>s+r.contribution,0)/total : null;
    return {candidate,rows,total,attributesScore,fit:right.fit,automatism:42,score:total?Math.round(attributesScore*0.5+right.fit*0.3+42*0.2):null};
  }
  // Qualitative role coverage; style is descriptive, never a hidden bonus.
  const simpleRoles = stats => [(stats[0]+stats[4])/2,stats[1],(stats[0]+stats[2]+stats[4]+stats[5])/4];
  const freshTraining = () => ({sessions:0,day:0,energy:76,confidence:50,stats:[4,6,3,7,3,7],history:[]});
  const trainingPlans={skill:{name:'Technique ciblée',factor:1.15,cost:1},minutes:{name:'Mise en situation',factor:0.85,cost:0.85},balanced:{name:'Séance équilibrée',factor:0.65,cost:0.65}};
  function train(state, planId, target, intensity, rng=Math.random) {
    if (state.sessions>=4 || state.energy<=0) return null;
    const p=trainingPlans[planId];
    if (!p || !Number.isInteger(target) || target<0 || target>5) throw Error('Séance invalide');
    const i=clamp(Number(intensity),0,100), before=structuredClone(state);
    const roll=rng(), variation=0.9+roll*0.2, readiness=state.energy/100;
    const rawGain=p.factor*(i/65)*1.2*readiness*variation;
    const gain=round(Math.min(15-state.stats[target],rawGain));
    const cost=Math.min(state.energy,Math.round(i/6*p.cost));
    const next=structuredClone(state);
    next.sessions++; next.day++; next.energy=round(next.energy-cost);
    next.stats[target]=round(next.stats[target]+gain);
    next.confidence=clamp(next.confidence+(i===0?0:planId==='minutes'?(roll>0.4?4:-3):2),0,100);
    const event={type:'training',day:next.day,session:next.sessions,planId,target,intensity:i,before:before.stats,after:[...next.stats],energyBefore:before.energy,energyAfter:next.energy,confidenceBefore:before.confidence,confidenceAfter:next.confidence,gain,cost,readiness,variation,roll,rawGain};
    next.history.push(event);
    return next;
  }
  function rest(state) {
    if(state.sessions>=4 || state.energy>=100) return null;
    const next=structuredClone(state), before=next.energy;
    next.day++;next.energy=Math.min(100,next.energy+18);
    next.history.push({type:'rest',day:next.day,energyBefore:before,energyAfter:next.energy});
    return next;
  }
  root.GameplayModels={simpleRoles,attributes,players,plans,teams,match,chemistry,freshTraining,trainingPlans,train,rest};
})(globalThis);
