# UI Gym : source visuelle commune

Toute nouvelle présentation doit être exposée et validée dans `InteractionLibrary` avant réutilisation. Ne pas créer une seconde palette ou une copie de fiche dans un gym fonctionnel.

- `ui-gym-foundation.css` : thèmes sémantiques extraits du UI Gym, polices, contrôles, choix, fiche et adaptateurs des pages statiques.
- `palette-masters.json` / `palette.json` : seules palettes maîtresses et dérivées. Les couleurs de statistiques en font partie.
- `ui-gym-components.tsx` : champ numérique, choix à trois positions, origine et fiche du modèle. La démo « Fiche et contrôles partagés » et Hockey Player importent les mêmes composants.
- `player-card.tsx`, `player-radar.tsx`, `lab.tsx` : cartes, radar, tableaux et fenêtres existants du UI Gym restent canoniques.
- `ui-gym-runtime.js` : préférences de thème/palette communes, synchronisées entre pages et iframe.
- `vite.pages.config.ts` génère `ui-gym-shared.css/js` pour Gameplay, statistiques et panneau intégré depuis les sources ci-dessus. Ne pas éditer ces sorties générées.

Les CSS des pages conservent leur disposition et leurs interactions propres. Les anciens scénarios de gameplay restent indépendants : cette migration est visuelle et ne remplace pas leurs formules ni leurs données. Les cartes historiques du roster et la fiche du modèle sont deux vues exposées dans le UI Gym, avec des données différentes.
