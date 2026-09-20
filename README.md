# Gestion hockey — UI Gym original restauré

Le vrai prototype **Hockey · Interface Gym**, version 30, a été récupéré depuis son dépôt Sites avec ses 30 commits, ses composants React et ses ressources originales.

- UI Gym en ligne : https://jutrasimon.github.io/gestion-hockey/
- Site original préservé : https://hockey-candy-gym.jutrasimon.chatgpt.site/
- Source originale intacte : branche `recovery/ui-gym-original-v30`.
- Détails de récupération : [docs/RESTORATION.md](docs/RESTORATION.md).

## Tester et compiler

Node.js 22.13 ou plus récent.

```sh
npm ci --ignore-scripts
npm run build:pages
npm run preview:pages
```

Ouvrir l’adresse affichée avec le chemin `/gestion-hockey/`.
GitHub Actions reconstruit et publie automatiquement les modifications de `main`.

## Contenu

Alignement interactif, cartes recto-verso, fiches joueurs, effectif, statistiques avancées, recherche, favoris, thèmes, palette de couleurs et 14 expériences de validation UI : cartes, juice, boutons, icônes, portraits, notifications, graphiques, filtres, mini-cartes, aperçus, états, formulaires, progression et palette.

Les données de joueurs sont fictives. Les préférences sont locales au navigateur et au domaine. Les sauvegardes du site Sites ne sont pas automatiquement transférées vers GitHub Pages.

La reconstruction HTML simplifiée et le Gameplay Gym du commit `37b21dd` restent dans l’historique; ils ne constituent plus la version publiée. Les fichiers de configuration Sites originaux sont conservés comme provenance. La publication GitHub utilise son propre adaptateur Vite et ne modifie pas le site Sites original.
