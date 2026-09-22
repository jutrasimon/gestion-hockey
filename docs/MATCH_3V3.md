# Match 3v3 — premier simulateur spatial

Accès : onglet **Match 3v3**, ou `?gym=match` depuis le UI Gym.

Six copies configurables du catalogue du UI Gym. Une période de 20 secondes actives représente 20 minutes hockey. Les buts suspendent le chronomètre 1,8 seconde. Pause, reprise, pas de 3 secondes hockey et rejouer avec une graine fixe sont disponibles. La configuration ne s’applique qu’au lancement suivant; aucune carrière n’est modifiée.

La patinoire `GymRink` est référencée dans le UI Gym (rubrique 16) et utilisée telle quelle par le simulateur. Palette, champs et choix proviennent de la base partagée.

## Règles et limites

Le moteur avance à pas fixes de 0,05 seconde active. Les positions déterminent récupération, proximité pour les vols/interceptions et qualité des tirs. Un changement de possession conserve les positions; un but replace au centre. Les coefficients complets sont affichés dans le gym et les événements donnent leurs calculs.

Contexte : voir les règles Cœur ci-dessous. Moral et confiance sont des valeurs de départ constantes pendant la période; énergie, mobilisation et émotions évoluent. Gabarit module la puissance de ±20 % au maximum.

Gardien identique des deux côtés : arrêt = 100 % − qualité pour un tir cadré non bloqué. Il y a aussi des blocs et des tirs hors cible avant le gardien.

Pas de chimie, remplacement, hors-jeu, pénalités, blessures, physique générale des collisions (seuls les placages sont résolus), déviations, progression ou personnalité active. Style créatif du vieux catalogue chargé comme neutre. Le rapport rebelle/conformiste est retiré des affichages de joueur; sa case historique reste seulement pour lire les sauvegardes.

## Validation

`node scripts/test-match-sim.mjs` : 100 périodes, répétabilité, conservation du décompte des tirs, limites spatiales, contexte, énergie nulle et pauses de but. Les essais navigateur vérifient lancement, pause/reprise et fin de période. L’équilibrage et la richesse du comportement restent à valider manette en main.

## Positionnement et choix des actions (révision)

Le porteur compare désormais conservation, passe et tir sans tirage de décision. Une échappée libre est conservée; les passes servent à améliorer une occasion, sortir de la pression ou avancer vers un partenaire libre. Le hasard intervient encore dans l’exécution.

Sans rondelle : un partenaire attaque le côté opposé, l’autre soutient en retrait. Les cibles recherchent de l’espace et des lignes de passe dans la largeur de la glace. Un défenseur presse, les deux autres couvrent chacun une menace. Une passe en mouvement conserve cette structure, avec un receveur immobile; une rondelle libre attire un récupérateur par équipe et deux soutiens.

Les plans sont recalculés toutes les 0,35 seconde, immédiatement si la possession change. La case « Voir les intentions » affiche les destinations en pointillés et le rôle actuel des six joueurs. Les poids et seuils de choix sont détaillés dans les règles du gym. Ce sont des comportements heuristiques, pas une IA de hockey complète.

Tests supplémentaires : échappée conservée, passe utile sous pression, refus d’une ligne couverte, largeur des soutiens, défense individuelle et maintien de formation pendant une passe.

## Vue de match compacte

Trois fiches vertes à gauche, trois bleues à droite, patinoire réduite au centre. Les attributs effectifs et leur base, le contexte et les compteurs individuels sont visibles simultanément. La fiche `GymMatchPlayer` est également présentée dans le UI Gym avec la patinoire partagée. Sur écran étroit, les deux équipes passent sous la glace.

Une aide est créditée à la dernière passe réussie avant un but, sans rondelle libre ou changement de possession. Passes = réussies/tentées; pertes = vols et interceptions subis. Les tirs cadrés excluent les tirs bloqués et hors cible. Les compteurs sont remis à zéro au lancement de chaque période et leur somme est testée contre les totaux des équipes.

## Mini-hockey, six attributs et contacts

Attributs : maniement, tir, puissance, rapidité, IQ hockey, cœur. Défense est supprimé. Vol/interception : maniement + IQ. Blocs : IQ; placement : IQ et géométrie; poursuite/esquive : rapidité; contact : puissance modulée par le gabarit. Le radar commun a six axes. Les brouillons v1/v2 sont convertis vers v3 en supprimant l’ancienne colonne Défense, sans déplacer la valeur de Cœur; sauvegardes v2 conservées séparément.

Glace physique 70 × 35 unités, soit 30 % plus courte et plus étroite. Positions SVG/tactiques normalisées 100 × 50; déplacements et distances d’action utilisent l’échelle physique 0,7. Le simple redimensionnement CSS n’affecte pas cette mécanique.

Placage contre le porteur à moins de 2,4 unités : puissance attaquant / (puissance attaquant + puissance victime + 0,5 × rapidité victime + 1), 10–80 %, puissance nulle = 0 %. Délai de 1,1 seconde par plaqueur. Succès : recul de 1,2–3 unités, ralentissement à 35 % pendant 0,5 seconde (victime) et 0,15 seconde (plaqueur), énergie −2/−1. Rondelle libérée avec une chance de 35 % + différence de puissance / 60, limitée 15–75 %. Elle est ensuite récupérable par les deux équipes. Compteurs individuels donnés/subis et marqueur visuel de contact pendant 0,7 seconde. Pas de blessures ni pénalités.

Cœur h = cœur de base / 15. Énergie utilisable = E + (1−E) × 0,30 × h (E en fraction), avec épuisement à E=0. Même atténuation pour le moral. Effectif = base × énergie utilisable × moral utilisable × (1 + 0,25 × confiance/100) × (1 + mobilisation). Énergie réelle inchangée par cette atténuation.

Mobilisation = +10 % × h si l’équipe perd, plus +10 % × h pendant deux minutes hockey après un but encaissé, un but égalisateur ou un placage subi. Plafond total +15 %. Les émotions se remplacent, elles ne s’additionnent pas. Les pauses de but figent le temps restant. La fatigue de fond demeure 0,18 × (1−cœur/30) par seconde active.

Toutes ces règles sont des hypothèses de gameplay visibles dans le gym, pas un équilibrage définitif.
