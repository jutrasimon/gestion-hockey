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
