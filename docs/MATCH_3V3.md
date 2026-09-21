# Match 3v3 — premier simulateur spatial

Accès : onglet **Match 3v3**, ou `?gym=match` depuis le UI Gym.

Six copies configurables du catalogue du UI Gym. Une période de 20 secondes actives représente 20 minutes hockey. Les buts suspendent le chronomètre 1,8 seconde. Pause, reprise, pas de 3 secondes hockey et rejouer avec une graine fixe sont disponibles. La configuration ne s’applique qu’au lancement suivant; aucune carrière n’est modifiée.

La patinoire `GymRink` est référencée dans le UI Gym (rubrique 16) et utilisée telle quelle par le simulateur. Palette, champs et choix proviennent de la base partagée.

## Règles et limites

Le moteur avance à pas fixes de 0,05 seconde active. Les positions déterminent récupération, proximité pour les vols/interceptions et qualité des tirs. Un changement de possession conserve les positions; un but replace au centre. Les coefficients complets sont affichés dans le gym et les événements donnent leurs calculs.

Contexte : base × énergie/100 × moral/100 × (1 + 0,25 × confiance/100). Ce produit et le plafond de confiance sont des hypothèses de test, pas un équilibre validé. Le cœur réduit la consommation d’énergie; moral et confiance restent constants pendant la période. Gabarit module la puissance de ±20 % au maximum.

Gardien identique des deux côtés : arrêt = 100 % − qualité pour un tir cadré non bloqué. Il y a aussi des blocs et des tirs hors cible avant le gardien.

Pas de chimie, remplacement, hors-jeu, pénalités, blessures, physique de collision, déviations, progression ou personnalité active. Style créatif du vieux catalogue chargé comme neutre. Le rapport rebelle/conformiste est retiré des affichages de joueur; sa case historique reste seulement pour lire les sauvegardes.

## Validation

`node scripts/test-match-sim.mjs` : 100 périodes, répétabilité, conservation du décompte des tirs, limites spatiales, contexte, énergie nulle et pauses de but. Les essais navigateur vérifient lancement, pause/reprise et fin de période. L’équilibrage et la richesse du comportement restent à valider manette en main.
