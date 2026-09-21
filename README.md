# Gestion hockey — UI Gym original restauré

Le vrai prototype **Hockey · Interface Gym**, version 30, a été récupéré depuis son dépôt Sites avec ses 30 commits, ses composants React et ses ressources originales.

- UI Gym en ligne : https://jutrasimon.github.io/gestion-hockey/
- Gameplay Gym : https://jutrasimon.github.io/gestion-hockey/gameplay.html
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

La reconstruction HTML simplifiée reste dans l’historique. Le Gameplay Gym du commit `37b21dd` est restauré séparément dans `public/gameplay.html`, avec ses propres styles et ses 10 expériences indépendantes. Ses décisions ne modifient pas l’équipe du UI Gym; seules les notes et les évaluations sont sauvegardées localement. Vite copie ces fichiers dans la publication. Les fichiers de configuration Sites originaux sont conservés comme provenance. La publication GitHub utilise son propre adaptateur Vite et ne modifie pas le site Sites original.

### Gym des statistiques

Ouvrir [le gym des statistiques](https://jutrasimon.github.io/gestion-hockey/stats.html) : 18 joueurs, attributs expliqués, saisons disponibles et mesures avancées avec formules. Données fictives partagées avec les sources du UI Gym.

### Hockey Player — modèle de conception

[Ouvrir le template éditable](https://jutrasimon.github.io/gestion-hockey/?gym=player) : tous les attributs, catalogues, règles expérimentales, profils et statistiques observées. Les outils du UI Gym sont intégrés. Documentation et notes de format 3 trios / 9–12 joueurs dans [docs/HOCKEY_PLAYER.md](docs/HOCKEY_PLAYER.md).
