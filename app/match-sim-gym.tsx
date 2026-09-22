import {GymMatchPlayer} from './ui-gym-match-player';
import { useEffect, useRef, useState } from 'react';
import { seed, labels } from './players';
import { GymChoice, GymNumberField, GymOrigin } from './ui-gym-components';
import { GymRink } from './ui-gym-rink';
import { createMatch, effective, phase, resumeGoal, stepMatch, type Skater, type Match } from './match-sim-model';
import { statColor } from './stat-color';
import './match-sim-gym.css';
const fromPlayer = (p: typeof seed[number]): Skater => ({ name: p.name, stats: [...p.stats], style: p.playStyle === 'Direct' ? 0 : p.playStyle === 'Prudent' ? 2 : 1, energy: 100, morale: 100, confidence: 0, weight: p.weight, height: Number(p.height.split(' ')[0]) * 12 + Number(p.height.split(' ').at(-1)) });
const clock = (time: number) => { const seconds = Math.floor(time * 60); return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; };
export function MatchSimGym() {
    const [players, setPlayers] = useState(() => seed.map(fromPlayer));
    const [randomSeed, setSeed] = useState(42);
    const [match, setMatch] = useState(() => createMatch(players, randomSeed));
    const [running, setRunning] = useState(false);
    const [selected, setSelected] = useState(0);
    const [showPlans, setShowPlans] = useState(true);
    const state = useRef<Match>(match);
    const pauseUntil = useRef(0);
    const [started, setStarted] = useState(false);
    useEffect(() => {
        if (!running)
            return;
        let raf = 0, last = performance.now(), accumulator = 0;
        function tick(now: number) {
            const elapsed = Math.min((now - last) / 1000, .1);
            last = now;
            const s = state.current;
            if (s.goalPause) {
                if (!pauseUntil.current)
                    pauseUntil.current = now + 1800;
                if (now >= pauseUntil.current) {
                    resumeGoal(s);
                    pauseUntil.current = 0;
                }
                accumulator = 0;
            }
            else {
                accumulator += elapsed;
                while (accumulator >= .05 && !s.goalPause && !s.ended) {
                    stepMatch(s);
                    accumulator -= .05;
                }
            }
            setMatch(structuredClone(s));
            if (s.ended) {
                setRunning(false);
                return;
            }
            raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(raf); pauseUntil.current = 0; };
    }, [running]);
    const launch = () => { const s = createMatch(players, randomSeed); state.current = s; setMatch(structuredClone(s)); setStarted(true); setRunning(true); };
    const update = (change: Partial<Skater>) => { const next = players.map((p, i) => i === selected ? { ...p, ...change } : p); setPlayers(next); const s = createMatch(next, randomSeed); state.current = s; setMatch(s); setStarted(false); };
    const p = players[selected], live = started ? match.agents[selected] : p, values = effective(live);
    return <div className="match-gym"><header><span className="eyebrow">GYM · SIMULATION SPATIALE</span><h2>Une période. Six joueurs. La rondelle.</h2><GymOrigin>Prototype 3v3 : positions, passes, interceptions, tirs et rebonds participent au calcul. 20 minutes = 20 secondes actives; pause de 1,8 seconde après un but. Un seul trio par équipe, joueurs en santé, sans chimie ni changements.</GymOrigin></header><div className="match-score"><strong>Verts {match.score[0]} — {match.score[1]} Bleus</strong><b>{clock(match.time)} / 20:00</b><span>{phase(match)}</span></div><div className="match-actions"><button onClick={launch} disabled={running}>{started ? 'Rejouer avec ces paramètres' : 'Jouer la période'}</button><button disabled={!started || match.ended} onClick={() => setRunning(v => !v)}>{running ? 'Pause' : 'Reprendre'}</button><button disabled={running || !started || match.ended} onClick={() => {
            if (state.current.goalPause)
                resumeGoal(state.current);
            else
                stepMatch(state.current);
            setMatch(structuredClone(state.current));
        }}>Un pas · 3 s hockey</button><GymNumberField label="Graine du hasard" value={randomSeed} min={1} max={999999} onChange={v => { setSeed(v); }}/></div><label className="match-plan-toggle"><input type="checkbox" checked={showPlans} onChange={e => setShowPlans(e.target.checked)}/>Voir les intentions · pointillés vers la position recherchée</label><p className="match-reading">Attributs : <b>effectif coloré</b>, base en petit dessous · Passes : réussies / tentées · Aides : dernière passe réussie avant le but, sans perte de contrôle · Pertes : vols/interceptions subis.</p><div className="match-live-board"><aside aria-label="Joueurs verts" className="match-team"><h3>Verts →</h3>{[0,1,2].map(i=><GymMatchPlayer key={i} match={match} index={i}/>)}</aside><div className="match-live-center"><GymRink match={match} showPlans={showPlans}/><div className="match-center-clock"><strong>{match.score[0]} — {match.score[1]}</strong><span>{clock(match.time)} / 20:00 · {phase(match)}</span></div></div><aside aria-label="Joueurs bleus" className="match-team"><h3>← Bleus</h3>{[3,4,5].map(i=><GymMatchPlayer key={i} match={match} index={i}/>)}</aside></div><div className="match-latest" role="status"><b>{match.events.at(-1)?.text}</b><span>{match.events.at(-1)?.detail}</span></div><p>Vert attaque à droite · bleu à gauche · numéro = joueur ci-dessous. Même configuration + même graine = même match. Les pauses ne consomment pas de temps de jeu.</p><div className="match-totals">{[0, 1].map(team => <p key={team}><b>{team === 0 ? 'Verts' : 'Bleus'}</b> · {match.shots[team]} tentatives · {match.misses[team]} hors cible · {match.blocks[team]} blocs défensifs · {match.saves[team]} arrêts du gardien · {match.turnovers[team]} pertes par vol/interception</p>)}</div>
 <section><h3>Les six joueurs · configuration de la prochaine période</h3><p>Choisis un emplacement, puis un joueur. Les copies sont indépendantes pour comparer un même joueur. Pendant la lecture, la configuration est verrouillée. Modifier un joueur à l’arrêt prépare une nouvelle période; le tableau montre alors ses valeurs de départ.</p><div className="match-slots">{players.map((a, i) => <button key={i} aria-pressed={selected === i} onClick={() => setSelected(i)}>{i < 3 ? 'Vert' : 'Bleu'} {i + 1} · {a.name}</button>)}</div><fieldset disabled={running} className="match-editor"><legend>{selected + 1} · {p.name}</legend><label>Charger un joueur<select value="" onChange={e => update(fromPlayer(seed[Number(e.target.value)]))}><option value="" disabled>Choisir dans les joueurs du UI Gym</option>{seed.map((a, i) => <option key={a.id} value={i}>{a.name}</option>)}</select></label><GymChoice label="Style · comportement sans rondelle" options={['Direct', 'Neutre', 'Prudent']} value={p.style} onChange={style => update({ style })}/><div className="match-fields">{(['energy', 'morale', 'confidence'] as const).map((key, i) => <GymNumberField key={key} label={['Énergie %', 'Moral %', 'Confiance %'][i]} value={p[key]} onChange={v => update({ [key]: v })}/>)}<GymNumberField label="Poids (lb)" value={p.weight} min={80} max={350} onChange={weight => update({ weight })}/><GymNumberField label="Taille (pouces)" value={p.height} min={48} max={90} onChange={height => update({ height })}/></div><table><caption>Base éditable → attribut utilisable {started ? 'dans la période affichée' : 'au départ'}. Unité / 15; confiance : dépassement possible.</caption><thead><tr><th>Attribut</th><th>Base prochaine période</th><th>Effectif {started ? 'en direct' : 'au départ'}</th></tr></thead><tbody>{labels.map((label, i) => <tr key={label}><th>{label}</th><td><GymNumberField label={label} value={p.stats[i]} min={0} max={15} step={.5} onChange={v => update({ stats: p.stats.map((n, j) => i === j ? v : n) })}/></td><td style={{ color: statColor(values[i]) }}>{values[i].toFixed(2)}</td></tr>)}</tbody></table></fieldset><p>Contexte affiché : énergie {live.energy.toFixed(1)} %, moral {live.morale} %, confiance {live.confidence} %. Rouge ≤ 5 · ambre ≤ 10 · vert &gt; 10. Aucun jugement de valeur sur le style.</p></section>
 <details open><summary>Les règles de cette version · tous les coefficients</summary><div className="match-rules"><p><b>Contexte.</b> Effectif = base × énergie / 100 × moral / 100 × (1 + 0,25 × confiance / 100). À 100 énergie, 100 moral, 0 confiance : 100 % du talent. Confiance 100 : +25 % maximum. Énergie 50 et moral 50 : 25 % avant confiance. Ce choix multiplicatif est une hypothèse à valider.</p><p><b>Plan collectif.</b> Le porteur cherche un couloir vers le filet. Un partenaire attaque le côté opposé; l’autre offre une sortie en retrait, de l’autre côté. Direct est prioritaire pour attaquer, prudent pour soutenir. Un défenseur contient le porteur; les deux autres couvrent chacun un partenaire côté filet. Sur rondelle libre : un poursuivant par équipe, deux soutiens. Pendant une passe, le receveur garde sa position. Les cibles sont réévaluées toutes les 0,35 seconde ou à un changement de possession.</p><p><b>Mouvement.</b> Vitesse = 2 + 1,3 × patinage effectif; arrêt si énergie ou moral à zéro. Le porteur examine trois couloirs (y = 12, 25, 38), 12 unités devant : score = 1,7 × ouverture de ligne + 0,6 × espace − 0,18 × écart au centre − 0,2 × trajet. Le soutien compare quatre positions autour de son rôle : 1,4 × ouverture (max. 12) + 0,9 × espace (max. 15) − 0,45 × écart à sa zone − 0,12 × trajet; pénalité 20 si à moins de 9 du porteur, puis 3 par unité manquante pour rester à 12 du partenaire.</p><p><b>Choix avec la rondelle.</b> Décision toutes les 0,45 / 0,65 / 0,9 seconde (direct / neutre / prudent). Chemin au but libre de plus de 5 unités et adversaire à plus de 7 : conserver, puis tirer dès 80 % de la glace. Sinon, passe à 6–42 unités si ligne libre de plus de 3 et si elle offre : une qualité de tir supérieure de 6 points en zone offensive, une sortie de pression (porteur à moins de 7, receveur au moins 2 unités plus libre), ou une avance de plus de 9 avec plus de 6 d’espace. Les receveurs sont classés par qualité × 100 + espace + 0,4 × avance (plancher −10). Sinon, tir au-delà de 75 % si qualité ≥ 12 %, ou au-delà de 87 %; sinon avancer. Aucun tirage pour décider de passer.</p><p><b>Lignes de passe et défense.</b> L’ouverture mesure la distance des adversaires au segment passeur–receveur; les adversaires derrière le départ sont ignorés. Pour le choix d’une passe, le défenseur à moins de 4 du porteur représente la pression et non une ligne bouchée; il peut tout de même intercepter ensuite. Le défenseur sur le porteur anticipe de 0,15 × IQ; les autres couvrent à 4 unités de leur adversaire côté filet. Sur rondelle libre : arrivée évaluée par distance / (1 + IQ / 30).</p><p><b>Gabarit.</b> Puissance physique = puissance effective × [1 + (poids − 190) / 500 + (taille − 72) / 100], facteur limité entre 0,8 et 1,2. Un duel de récupération oppose puissance physique + maniement; probabilité = score / (somme des deux scores + 1).</p><p><b>Vol à moins de 5 unités.</b> Attaque = maniement + puissance physique. Défense = défense + maniement + 0,3 × puissance physique. Chance de vol par décision = défense / (attaque + défense + 1) × 50 %. Les positions restent en place après un vol.</p><p><b>Passes.</b> La rondelle voyage à 75 unités/s. À moins de 3 unités d’un adversaire : interception = (défense + maniement adverse) / (ce score + maniement passeur + IQ passeur + 1) × 65 %, par pas de 3 secondes hockey. Réception = 55 % + (maniement passeur + receveur + IQ passeur) / 100, plafond 97 %.</p><p><b>Tir.</b> Quand le joueur choisit de tirer : bloc possible si défenseur à moins de 5 unités, chance = défense / 15 × 25 %. Sinon cadrage = 70 % + tir / 50, plafond 100 %. Qualité = (0,65 × tir + 0,20 × puissance physique + 0,15 × IQ) / 15 × position × pression × 65 %, plafond 90 %. Position = 1 − distance au but / 55, limitée 0,15–1. Pression = distance du défenseur / 8, limitée 0,4–1.</p><p><b>Gardien fictif.</b> Sur tir cadré non bloqué : probabilité de but = qualité; probabilité d’arrêt = 100 % − qualité. Un arrêt produit un rebond. Les deux gardiens ont la même règle.</p><p><b>Cœur.</b> Perte d’énergie par seconde active = 0,18 × (1 − cœur de base / 30). Le cœur réduit uniquement la fatigue ici. Inspiration, blessures, déviations, contacts physiques détaillés et effets de personnalité ne sont pas simulés. Aucun effet des relations, potentiel ou âge pendant cette période.</p></div></details><section><h3>Journal · calculs des actions</h3><p>Les pourcentages sont des probabilités, pas des garanties. Le tirage doit être inférieur à la chance de réussite.</p><ol className="match-log">{match.events.slice().reverse().map((e, i) => <li key={match.events.length - i}><b>{clock(e.time)} · {e.text}</b>{e.detail && <p>{e.detail}</p>}</li>)}</ol></section></div>;
}
