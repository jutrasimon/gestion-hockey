// Spatial prototype. Time is active real seconds; one second represents one hockey minute.
export type Skater = {
    name: string;
    stats: number[];
    style: number;
    energy: number;
    morale: number;
    confidence: number;
    weight: number;
    height: number;
};
export type Agent = Skater & {
    team: number;
    slot: number;
    x: number;
    y: number;
};
export type Event = {
    time: number;
    text: string;
    detail: string;
};
export type Match = {
    time: number;
    agents: Agent[];
    owner: number;
    puck: {
        x: number;
        y: number;
    };
    flight: null | {
        kind: 'pass' | 'shot';
        from: number;
        to: number;
        x: number;
        y: number;
        quality: number;
    };
    score: number[];
    shots: number[];
    saves: number[];
    blocks: number[];
    misses: number[];
    turnovers: number[];
    rng: number;
    decision: number;
    looseUntil: number;
    goalPause: boolean;
    ended: boolean;
    events: Event[];
};
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const effective = (p: Skater) => p.stats.map(v => v * p.energy / 100 * p.morale / 100 * (1 + .25 * p.confidence / 100));
export const physical = (p: Skater) => effective(p)[2] * clamp(1 + (p.weight - 190) / 500 + (p.height - 72) / 100, .8, 1.2);
const distance = (a: {
    x: number;
    y: number;
}, b: {
    x: number;
    y: number;
}) => Math.hypot(a.x - b.x, a.y - b.y);
function random(s: Match) { s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0; return s.rng / 4294967296; }
function log(s: Match, text: string, detail = '') { s.events.push({ time: s.time, text, detail }); }
export function phase(s: Match) { if (s.ended)
    return 'Période terminée'; if (s.goalPause)
    return 'But · pause'; if (s.flight)
    return s.flight.kind === 'pass' ? 'Passe en mouvement' : 'Tir vers le filet'; if (s.owner < 0)
    return 'Rondelle libre · récupération'; const p = s.agents[s.owner], x = p.team === 0 ? p.x : 100 - p.x; return x < 33 ? 'Sortie de zone' : x < 66 ? 'Transition · zone neutre' : x < 77 ? 'Entrée offensive' : 'Positionnement · occasion de tir'; }
function resetPositions(s: Match, team: number) { s.agents.forEach(p => { p.x = p.team === 0 ? 40 : 60; p.y = 12 + p.slot * 13; }); s.owner = s.agents.findIndex(p => p.team === team && p.slot === 1); s.agents[s.owner].x = 50; s.puck = { x: 50, y: 25 }; s.flight = null; s.decision = .5; }
export function createMatch(players: Skater[], seed = 1): Match { if (players.length !== 6)
    throw Error('Six joueurs requis'); const agents = players.map((p, i) => { if (p.stats.length !== 7 || ![...p.stats, p.energy, p.morale, p.confidence, p.weight, p.height, p.style].every(Number.isFinite))
    throw Error('Valeurs invalides'); return { ...p, stats: p.stats.map(v => clamp(v, 0, 15)), energy: clamp(p.energy, 0, 100), morale: clamp(p.morale, 0, 100), confidence: clamp(p.confidence, 0, 100), style: clamp(Math.round(p.style), 0, 2), team: i < 3 ? 0 : 1, slot: i % 3, x: 0, y: 0 }; }); const s: Match = { time: 0, agents, owner: 0, puck: { x: 50, y: 25 }, flight: null, score: [0, 0], shots: [0, 0], saves: [0, 0], blocks: [0, 0], misses: [0, 0], turnovers: [0, 0], rng: seed >>> 0, decision: .5, looseUntil: 0, goalPause: false, ended: false, events: [] }; resetPositions(s, random(s) < .5 ? 0 : 1); log(s, 'Mise en jeu', s.agents[s.owner].name + ' commence avec la rondelle (tirage 50/50).'); return s; }
function take(s: Match, index: number, reason: string, detail: string) { if (s.owner >= 0 && s.agents[s.owner].team !== s.agents[index].team)
    s.turnovers[s.agents[s.owner].team]++; s.owner = index; s.flight = null; s.decision = .45; log(s, reason + ' · ' + s.agents[index].name, detail); }
function loose(s: Match) { s.owner = -1; s.flight = null; s.looseUntil = s.time + .18; }
export function resumeGoal(s: Match) { if (!s.goalPause)
    return; const team = s.agents[s.owner].team; resetPositions(s, 1 - team); s.goalPause = false; log(s, 'Reprise au centre'); }
function move(p: Agent, target: {
    x: number;
    y: number;
}, dt: number) { const speed = 2 + effective(p)[3] * 1.3; const d = distance(p, target), step = Math.min(d, speed * dt); if (d && p.energy > 0 && p.morale > 0) {
    p.x = clamp(p.x + (target.x - p.x) / d * step, 3, 97);
    p.y = clamp(p.y + (target.y - p.y) / d * step, 3, 47);
} }
export function stepMatch(s: Match, dt = .05) {
    if (s.ended || s.goalPause)
        return;
    dt = clamp(dt, 0, .05);
    dt = Math.min(dt, 20 - s.time);
    s.time += dt;
    s.decision -= dt;
    const owner = s.owner >= 0 ? s.agents[s.owner] : null;
    for (const p of s.agents) {
        const e = effective(p), dir = p.team === 0 ? 1 : -1;
        let target = { ...s.puck };
        if (owner) {
            if (p === owner) {
                target = { x: p.team === 0 ? 89 : 11, y: 25 + (p.slot - 1) * 6 };
            }
            else if (p.team === owner.team) {
                const lead = p.style === 0 ? 13 : p.style === 2 ? -14 : 3;
                target = { x: owner.x + dir * lead, y: clamp(owner.y + (p.slot - owner.slot) * 11, 7, 43) };
            }
            else {
                const nearest = s.agents.filter(a => a.team === p.team).sort((a, b) => distance(a, owner) - distance(b, owner))[0];
                target = p === nearest ? { x: owner.x - dir * e[4] * .2, y: owner.y } : { x: owner.x - dir * (8 + e[5] * .25), y: 12 + p.slot * 13 };
            }
        }
        move(p, target, dt);
        // Heart slows energy loss; no injury, morale or confidence evolution in this prototype.
        p.energy = clamp(p.energy - dt * .18 * (1 - p.stats[6] / 30), 0, 100);
    }
    if (s.flight) {
        const f = s.flight, from = s.agents[f.from];
        if (f.kind === 'pass') {
            f.x = s.agents[f.to].x;
            f.y = s.agents[f.to].y;
        }
        const d = distance(s.puck, f), step = 75 * dt;
        s.puck = d <= step ? { x: f.x, y: f.y } : { x: s.puck.x + (f.x - s.puck.x) / d * step, y: s.puck.y + (f.y - s.puck.y) / d * step };
        if (f.kind === 'pass') {
            const defender = s.agents.find(a => a.team !== from.team && distance(a, s.puck) < 3);
            if (defender) {
                const attack = effective(from)[0] + effective(from)[4], def = effective(defender)[5] + effective(defender)[0], chance = clamp(def / (def + attack + 1) * .65, 0, .8);
                const roll = random(s);
                if (roll < chance) {
                    s.owner = f.from;
                    take(s, s.agents.indexOf(defender), 'Interception', `Défense + maniement contre maniement + IQ : ${(chance * 100).toFixed(0)} %, tirage ${(roll * 100).toFixed(0)}.`);
                }
            }
        }
        if (s.flight && d <= step) {
            if (f.kind === 'pass') {
                const receiver = s.agents[f.to], chance = clamp(.55 + (effective(from)[0] + effective(receiver)[0] + effective(from)[4]) / 100, 0, .97), roll = random(s);
                if (roll < chance)
                    take(s, f.to, 'Passe reçue', `55 % + (maniement passeur + receveur + IQ passeur) / 100 = ${(chance * 100).toFixed(0)} %; tirage ${(roll * 100).toFixed(0)}.`);
                else {
                    log(s, 'Passe échappée', `${receiver.name} · réception ${(chance * 100).toFixed(0)} %, tirage ${(roll * 100).toFixed(0)}.`);
                    loose(s);
                }
            }
            else {
                const roll = random(s);
                s.flight = null;
                s.owner = f.from;
                if (roll < f.quality) {
                    s.score[from.team]++;
                    s.goalPause = true;
                    log(s, 'BUT · ' + from.name, `Qualité ${(f.quality * 100).toFixed(1)} %; arrêt ${(100 - f.quality * 100).toFixed(1)} %; tirage ${(roll * 100).toFixed(1)}.`);
                }
                else {
                    s.saves[1 - from.team]++;
                    log(s, 'Arrêt · rebond', `Qualité ${(f.quality * 100).toFixed(1)} %; tirage ${(roll * 100).toFixed(1)}.`);
                    s.puck = { x: from.team === 0 ? 86 : 14, y: 12 + random(s) * 26 };
                    loose(s);
                }
            }
        }
    }
    else if (s.owner < 0) {
        if (s.time >= s.looseUntil) {
            const candidates = s.agents.map((p, i) => ({ p, i, rank: distance(p, s.puck) / (1 + effective(p)[4] / 30) })).filter(({ p }) => distance(p, s.puck) < 4 && p.energy > 0 && p.morale > 0).sort((a, b) => a.rank - b.rank);
            if (candidates.length) {
                let winner = candidates[0];
                if (candidates[1] && candidates[1].p.team !== winner.p.team) {
                    const other = candidates[1], a = physical(winner.p) + effective(winner.p)[0], b = physical(other.p) + effective(other.p)[0];
                    if (random(s) > a / (a + b + 1))
                        winner = other;
                }
                take(s, winner.i, 'Récupération', 'Arrivée : distance / (1 + IQ / 30). Duel proche : puissance avec gabarit + maniement.');
            }
        }
    }
    else {
        const p = s.agents[s.owner];
        s.puck = { x: p.x, y: p.y };
        if (s.decision <= 0) {
            s.decision = p.style === 0 ? .45 : p.style === 2 ? .9 : .65;
            const e = effective(p), opponents = s.agents.filter(a => a.team !== p.team), near = opponents.sort((a, b) => distance(a, p) - distance(b, p))[0], gap = distance(near, p);
            if (gap < 5) {
                const de = effective(near), atk = e[0] + physical(p), def = de[5] + de[0] + physical(near) * .3, chance = def / (def + atk + 1) * .5, roll = random(s);
                if (roll < chance) {
                    take(s, s.agents.indexOf(near), 'Rondelle volée', `(Défense + maniement + 0,3 × puissance physique) / (attaque + défense + 1) × 50 % = ${(chance * 100).toFixed(0)} %; tirage ${(roll * 100).toFixed(0)}.`);
                    return;
                }
            }
            const progress = p.team === 0 ? p.x : 100 - p.x;
            if (progress > 75 && e[1] > 0) {
                const goal = { x: p.team === 0 ? 97 : 3, y: 25 }, range = distance(p, goal), position = clamp(1 - range / 55, .15, 1), pressure = clamp(gap / 8, .4, 1), quality = clamp((.65 * e[1] + .2 * physical(p) + .15 * e[4]) / 15 * position * pressure * .65, 0, .9);
                s.shots[p.team]++;
                const block = gap < 5 ? effective(near)[5] / 15 * .25 : 0, roll = random(s);
                if (roll < block) {
                    s.blocks[near.team]++;
                    log(s, 'Tir bloqué · ' + near.name, `Défense / 15 × 25 % = ${(block * 100).toFixed(1)} %; tirage ${(roll * 100).toFixed(1)}.`);
                    loose(s);
                }
                else if (random(s) > .7 + Math.min(e[1], 15) / 50) {
                    s.misses[p.team]++;
                    log(s, 'Tir hors cible · ' + p.name, 'Cadrage = 70 % + tir / 50 (maximum 100 %).');
                    s.puck = { x: goal.x, y: clamp(p.y + 12, 3, 47) };
                    loose(s);
                }
                else {
                    s.flight = { kind: 'shot', from: s.owner, to: -1, ...goal, quality };
                    log(s, 'Tir cadré · ' + p.name, `Talent ${((.65 * e[1] + .2 * physical(p) + .15 * e[4]) / 15).toFixed(2)} × position ${position.toFixed(2)} × pression ${pressure.toFixed(2)} × 65 % = qualité ${(quality * 100).toFixed(1)} %.`);
                    s.owner = -1;
                }
            }
            else {
                const mates = s.agents.map((a, i) => ({ a, i })).filter(({ a }) => a.team === p.team && a !== p && distance(a, p) > 5 && distance(a, p) < 40).sort((a, b) => { const value = (x: Agent) => (p.team === 0 ? x.x : 100 - x.x) + Math.min(...opponents.map(d => distance(d, x))); return value(b.a) - value(a.a); });
                if (mates.length && random(s) < (p.style === 2 ? .7 : .4)) {
                    const mate = mates[0];
                    s.flight = { kind: 'pass', from: s.owner, to: mate.i, x: mate.a.x, y: mate.a.y, quality: 0 };
                    log(s, 'Passe · ' + p.name + ' → ' + mate.a.name);
                    s.owner = -1;
                }
            }
        }
    }
    if (s.time >= 20 - 1e-8) {
        s.time = 20;
        s.ended = true;
        s.goalPause = false;
        log(s, 'Fin de période', '20 minutes de hockey · 20 secondes actives.');
    }
}
