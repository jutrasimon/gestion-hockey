# Restauration du UI Gym original — 20 septembre 2026

Le dépôt source original de Hockey · Interface Gym a été retrouvé dans Sites.
Ses 30 commits ont été clonés, vérifiés avec `git fsck --full` et sauvegardés.
La version 30 correspond à `197ada10768ea618122227b3b58c09f6ce55cb52`.

- Original intact sur GitHub : branche `recovery/ui-gym-original-v30`.
- Reconstruction précédente : conservée dans l’historique Git, commit `37b21dd`.
- Archives Git locales indépendantes : `hockey-ui-original-v30.bundle` et
  `hockey-reconstruction-before-restore.bundle`, dans le dossier parent.

## Publication GitHub Pages

L’interface React originale est compilée avec `npm run build:pages`.
`pages-main.tsx` reprend l’initialisation des couleurs et du thème de
`app/layout.tsx`. `vite.pages.config.ts` adapte les chemins des portraits et
liens au préfixe `/gestion-hockey/`. Les composants originaux ne sont pas
réécrits. Les polices et portraits sont inclus dans la publication.

Le workflow `.github/workflows/pages.yml` reconstruit et publie `main`.
Les réglages GitHub Pages doivent utiliser la source **GitHub Actions**.
Le site Sites original n’est pas modifié par cette publication.

Les préférences locales restent propres à chaque domaine : celles enregistrées
sur le site original ne sont pas automatiquement transférées vers GitHub Pages.
