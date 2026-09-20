# Gameplay Gym

Le Gameplay Gym est un laboratoire séparé du UI Gym. Son objectif n'est pas de représenter le jeu final, mais de tester rapidement des décisions, des conséquences et des formules sans contaminer les autres systèmes.

## Principe d'une micro-boucle

Chaque expérience suit la même structure :

1. Une situation courte et lisible.
2. Une décision parmi trois approches distinctes.
3. Un paramètre à doser avec un curseur.
4. Une simulation avec une petite variance.
5. Un résultat chiffré et trois conséquences.
6. Un verdict de design : à jeter, à retravailler ou à garder.
7. Une note libre sauvegardée localement.

Les verdicts et notes utilisent `localStorage`. Les données d'équipe du UI Gym ne sont jamais modifiées.

## Les 10 expériences

| # | Boucle | Question testée |
|---|---|---|
| 1 | Match express | Un plan de match donne-t-il un résultat crédible et lisible? |
| 2 | Chimie de trio | Composer un trio produit-il un casse-tête intéressant? |
| 3 | Développement | L'entraînement oppose-t-il gain rapide et trajectoire durable? |
| 4 | Négociation | Le joueur voit-il l'humain derrière le chiffre? |
| 5 | Scouting | L'information imparfaite crée-t-elle du suspense? |
| 6 | Échange | Une offre force-t-elle un sacrifice clair? |
| 7 | Gardiens | Le meilleur gardien est-il toujours le bon choix? |
| 8 | Blessure | Le retour au jeu crée-t-il une tension réelle? |
| 9 | Vestiaire | Un conflit produit-il une décision de gestion intéressante? |
| 10 | Semaine | Le joueur doit-il prioriser avant d'avancer le temps? |

## Règle d'architecture

Chaque boucle doit pouvoir être remplacée par une nouvelle formule sans modifier les neuf autres. Pour le prototype, les définitions et formules sont regroupées dans le tableau `loops` de `gameplay.js`. Une migration future pourra déplacer chaque boucle dans son propre module.

## Ce que le prototype ne prétend pas valider

- L'équilibrage final.
- La durée réelle d'une saison.
- La simulation statistique complète d'un match.
- L'économie finale des contrats et échanges.
- La taxonomie complète des traits, blessures ou événements.

La valeur testée est la qualité de la décision : compréhension, tension, résultat et désir de rejouer.
