# Gameplay Gym — règles expérimentales, révision 2

Adresse : https://jutrasimon.github.io/gestion-hockey/gameplay.html

Les dix modules restent isolés du UI Gym. Les trois premiers utilisent les
modèles testables de `public/gameplay-models.js`; leur interface se trouve dans
`public/gameplay-lab.js`. Les sept autres conservent leurs premières formules.

## Match Express

Le précédent modèle choisissait entre trois scores prédéfinis. Il est remplacé
par un tirage par tir, avec bilan et journal des tirages. Québec a des forces
attaque/défense/gardien de 8,2 / 8,1 / 8,3; Montréal de 8,8 / 8,4 / 8.
Un effectif montréalais fictif est affiché; les forces collectives sont des
paramètres indépendants explicitement présentés comme tels.

Le plan ajoute des tirs, augmente/réduit le risque de revirement sur 20 possessions
et les tirs adverses. Intensité : 0–100. Fatigue : arrondi(18 × (intensité/100)²),
soit 9 points à 72 et 18 à 100. Les formules, les valeurs réellement utilisées,
les arrondis et les tirages sont visibles dans le résultat. Les nombres aléatoires
sont indépendants, uniformes sur [0,1[. Les scores égaux restent des égalités
après 60 minutes; aucune prolongation n’est simulée. Le score d’expérience 88
disparaît, car il n’expliquait ni une probabilité ni la simulation.

## Chimie de trio

Gagnon au centre, Fortin à gauche; Sokolov, Morin ou Roy à droite (Roy étant
habituellement ailière gauche). Sept interrupteurs contrôlent les **poids** des
attributs, sans modifier les notes des joueurs : arrêt = 0, marche = 100.
Une saisie numérique 0–100 permet de nuancer chaque poids. Un poids non nul
apparaît actif. Tous les poids nuls suspendent le calcul.

Pour chaque attribut : niveau = moyenne des notes / 15 × 100;
complémentarité = max(0, 100 − |étendue − 3| × 12).
Valeur = 40 % niveau + 60 % complémentarité.
Chimie = arrondi(50 % moyenne pondérée + 30 % entente des rôles + 20 % automatismes).
Rôles : Sokolov 72, Morin 94, Roy 62. Automatismes fixes à 42.
L’écart optimal de 3 et les coefficients sont des hypothèses de design,
pas des règles validées. Aucun hasard ici, pour faciliter les comparaisons.

## Entraînement

Émilie commence à 76 énergie, 50 confiance, et [4,6,3,7,3,5,7] sur 15.
Quatre séances successives, avec cible et plan modifiables à chaque fois.
Gain = facteur de plan × charge/65 × 1,2 (potentiel élevé) × énergie/100
× (0,9 + tirage × 0,2), arrondi à deux décimales et plafonné à 15.
Coût = arrondi(charge/6 × facteur de coût), limité à l’énergie disponible.
Facteurs gain/coût : technique 1,15/1; mise en situation 0,85/0,85;
équilibré 0,65/0,65. Repos : +18 énergie, plafond 100; avance le jour,
sans consommer une séance. À énergie nulle, repos requis. À charge nulle,
aucun gain/coût/confiance, mais la séance compte. Le programme se termine
après quatre séances. Les tableaux et le journal montrent les transitions.

État conservé en mémoire pendant la visite, y compris entre modules. Le bouton
Recommencer réinitialise seulement le module courant. Recharger la page efface
le programme. Les évaluations et notes de design restent en localStorage.

## Vérification

`node scripts/test-gameplay.mjs` vérifie les comptes de tirs/buts/pertes,
les effets des plans, une victoire possible à intensité zéro, les poids de
chimie, les gains ciblés, la fatigue cumulative, le repos et les bornes.
Ce contrôle s’exécute aussi avant chaque publication GitHub Pages.


## Révision contrats, scouting et pool inter-ligues

- Contrat : salaire 2–6 M$, durée 1–5 ans, prime 0/10/25 % du salaire de la première année (incluse, non additionnelle). Satisfaction = arrondi puis borne 0–100 de 45 + (salaire − 4,4) × 35 + (années − 2) × 6 + fraction de prime × 20. Signature à 70. Contre-offre arrondie au dixième supérieur pour atteindre le seuil exact; aucun hasard, rôle ou trait caché. Argent affiché au millième de M$ pour conserver la somme des versements.
- Scouting : budget 90 000 pièces; public gratuit, visite 15 000 (+15), approfondi 30 000 (+30). Fiabilité initiale 40 prospect, 88 vedette, plafond 95 par domaine. Ce score n’est ni du talent ni une probabilité calibrée. Tir/maniement et patinage/puissance sont des observations distinctes; rencontre et examen médical donnent des informations qualitatives. Les répétitions au plafond ne sont pas facturées. Données de scénario fictives.
- Échanges : ancienne formule supprimée. Lot local à cible unique, pool de ligues parallèles, offres concurrentes fictives résolues ensemble, exclusion des offres de même ligue que la cible. Arbitrage expérimental visible. Aucun transfert réel, réseau, saison persistante ni résolution multi-cibles.
- Les états des expériences vivent dans l’onglet; recharger remet les scénarios à zéro. Les notes et verdicts utilisent localStorage. Écritures des notes différées de 250 ms, vidées à pagehide; JSON invalide et stockage indisponible ne bloquent plus le lancement. Chimie recalculée au plus une fois par image pour les changements de poids.

## Gym des statistiques

`stats.html` importe les 18 joueurs et mesures directement depuis `app/players.ts`, `app/league.ts`, `app/advanced-stats.ts`. Il explique les sept attributs, le profil, les axes de personnalité et les 20 mesures à 5 contre 5. Les quatre lignes d’historique (deux saisons × régulière/séries) restent présentes indépendamment du filtre avancé; absence de données explicitement indiquée. Valeurs fictives de référence, pas de synchronisation avec les modifications temporaires du UI Gym; pas de reconstruction d’attributs historiques.

Validation : tests Node des coûts et contre-offres, budgets et plafonds de scouting, domaines révélés, exclusion intra-ligue et arbitrage. Parcours navigateur contrat → contre-offre → signature, deux domaines scouting, lot verrouillé, 24 changements rapides de chimie, sélection de joueurs et périodes. La cause des gels signalés n’a pas été reproduite; aucune garantie de résolution générale.

### Statistiques pendant les expériences

Le Gameplay Gym embarque `stats-panel.html` dans un panneau fixe à droite, ou en bas sur petit écran. Le joueur choisi reste affiché lors des changements de module et le panneau défile indépendamment. Les valeurs de référence, les sept définitions partagées avec le gym des stats, les quatre périodes historiques et les mesures avancées sont accessibles sans perdre le scénario. Les résultats temporaires des simulations ne sont pas synchronisés avec ces références.

### Mode Simple — chiffres et formules visibles

Mode par défaut avec des règles indépendantes du Laboratoire. Chaque mode garde ses essais en mémoire; Recommencer réinitialise uniquement le mode courant. Notes/verdicts restent partagés par module. Recharger remet les essais à zéro.

- Trio : création = moyenne des IQ, finition = meilleur tir, défense = moyenne des défenses. Les trois joueurs, calculs, résultats /15 et différences de chaque candidat par rapport au choix courant sont affichés. Il s’agit de force du trio, sans bonus de chimie ni de style. Affichage à une décimale.
- Match : Québec attaque8/défense8; Montréal attaque9/défense8, paramètres fixes. Tirs = 20 + 2 × (attaque − défense adverse) + effet du plan. Prudent : −4 tirs de chaque côté, fatigue4; équilibré : 0/0, fatigue8; offensif : +6/+4, fatigue12. Chaque tir lance un dé10; 1 marque. Buts attendus = tirs/10. Dés vérifiables, pas d’autre correction ni prolongation.
- Entraînement : légère +0,25/coût5, normale +0,5/coût10, intense +1/coût20. Gain multiplié par1 si énergie avant ≥40, sinon par0,5; arrondi au centième et plafond15. Énergie suffisante obligatoire. Repos +20 plafonné100, un jour sans consommer de séance. Quatre séances; aucun hasard. Prévision et bilan chiffrés visibles.
- Panneau de stats conservé. Modèles originaux du Laboratoire inchangés.

### Défense et style de jeu

Le sixième attribut est Défense, remplaçant Créativité dans tous les écrans et moteurs. Les nouvelles notes de démonstration sont Roy 4, Gagnon 8, Sokolov 5, Fortin 5, Leclerc 6, Morin 8; elles ne sont pas déduites des anciennes notes de créativité. Les joueurs dérivés conservent la méthode de variation du roster. Le style (Créatif, Prudent, Direct) décrit une façon de jouer sans bonus caché. Le trio simple affiche la moyenne des défenses; la chimie du Laboratoire utilise le poids réglable de Défense. Scouting : nouveau domaine Défense/IQ. Entraînement : Défense peut être ciblée dans les deux modes. Les forces collectives du Match restent des paramètres de scénario, sans moyenne automatique du roster.

La synthèse du trio Simple apparaît avant les candidats : force globale = moyenne des trois aspects, chacun comptant pour un tiers. Le calcul utilise les valeurs avant arrondi. Les cartes des candidats montrent aussi la force globale et son écart au trio actuel. La chimie est explicitement indiquée comme non simulée, sans inventer une note d’entente.
