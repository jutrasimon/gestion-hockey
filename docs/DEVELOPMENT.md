# Guide développeur

## Philosophie

Le prototype doit rester **smooth, lisible et très manipulable** : cartes, sliders, tableaux, tooltips et drag-and-drop. Les systèmes doivent être séparés afin de pouvoir remplacer les données fictives par une vraie simulation sans réécrire l'interface.

## Architecture actuelle

Cette récupération est volontairement simple :

- `index.html` : structure de l'interface.
- `styles.css` : design system, responsive, composants et couleurs.
- `app.js` : données fictives, rendu, filtres, favoris, drag-and-drop, thème et particules.

Aucun framework ni build step n'est requis.

## État local

Les données utilisateur suivantes utilisent `localStorage` :

- `hockey-order` : répartition trio / banc.
- `hockey-favorites` : joueurs favoris.
- `hockey-theme` : thème clair ou sombre.

Le bouton **Réinitialiser** efface l'ordre et les favoris.

## Couleurs

Toutes les couleurs fonctionnelles doivent passer par le système de variables CSS. Voir `COLOR_SYSTEM.md`.

Ne pas ajouter de couleur métier directement dans un composant JS.

## Dégradés

Les barres et valeurs utilisent des dégradés **du haut vers le bas**. Pour une valeur chiffrée, l'intensité doit dépendre de la valeur elle-même, pas de la position horizontale.

## Tooltips

- Les cartes peuvent utiliser un tooltip riche/contextuel.
- Les entêtes de tableaux utilisent un tooltip compact dédié.
- Éviter d'utiliser le même composant visuel pour ces deux besoins.

## Prochaines étapes recommandées

1. Séparer les données dans `data/players.json` ou une API.
2. Ajouter une vraie couche de simulation saison / matchs.
3. Ajouter historique complet des blessures.
4. Ajouter chimie de lignes et combinaisons.
5. Ajouter contrats, agents, échanges et plafond salarial.
6. Ajouter observatoire/scouting et filtres persistants.
7. Ajouter tests automatisés de règles et tests UI.
8. Migrer vers TypeScript/React seulement lorsque le prototype fonctionnel le justifie.
