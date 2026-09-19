# Gestion hockey — Hockey Club Lab

Prototype d'interface web pour un jeu de gestion de hockey asynchrone centré sur l'évolution des joueurs, la composition de l'équipe, les contrats, les statistiques et les combinaisons de joueurs.

## Statut de cette archive

**Archive de récupération v21 — 19 septembre 2026.**

Le site publié `hockey-candy-gym.jutrasimon.chatgpt.site` était encore identifiable, mais le dépôt GitHub `jutrasimon/gestion-hockey` ne contenait que son README initial. Le transfert du code source du 18 septembre n'a donc pas abouti.

Cette archive reconstruit une base locale fonctionnelle à partir de la version v21 publiée/indexée et des spécifications validées du projet. Elle sert de point de reprise propre et documenté.

Voir `RECOVERY_NOTES.md` pour ce qui a été récupéré et ce qui ne peut pas être garanti identique au source perdu.

## Lancer le site

Aucune compilation requise.

1. Ouvrir `index.html` dans un navigateur moderne; ou
2. Servir le dossier avec un petit serveur HTTP local.

Exemple :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Fonctionnalités incluses

- Alignement : premier trio + banc.
- Cartes de joueurs avec statistiques, attributs et contrat.
- Drag-and-drop entre trio et banc.
- Fiche détaillée de joueur.
- Favoris persistants avec `localStorage`.
- Filtres avancés par position, type, âge et note.
- Tableau comparatif avec tooltips sur les entêtes.
- Thème sombre / clair.
- Système centralisé de couleurs en variables CSS.
- Dégradés verticaux et intensité visuelle liée aux valeurs.
- Particules de souris très fines.
- Masse salariale et plafond de test.
- Interface responsive mobile / desktop.

## Structure

```text
/
├─ index.html
├─ styles.css
├─ app.js
├─ README.md
├─ RECOVERY_NOTES.md
├─ assets/
│  └─ favicon.svg
└─ docs/
   ├─ PLAYER_MODEL.md
   ├─ DEVELOPMENT.md
   └─ COLOR_SYSTEM.md
```

## Données

Les joueurs sont fictifs et servent uniquement au prototype. Les données sont définies dans `app.js`.

## Dépôt cible

`https://github.com/jutrasimon/gestion-hockey`
