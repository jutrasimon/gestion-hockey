# Palette du gym

`app/palette.json` est l’unique source des couleurs littérales de l’interface. Le catalogue conserve toutes les nuances existantes sans changer la direction artistique. Les composants CSS et SVG consomment `var(--palette-...)`, directement ou via les variables sémantiques existantes (`--background`, `--ring`, `--player-accent`, etc.). Les transparences sont dérivées par `color-mix`, sans copie de la couleur.

Gym → Palette de couleurs : couleurs principales, recherche dans les nuances, édition, restauration individuelle/globale, import/export JSON. Les changements sont immédiats et sauvegardés localement sous `hockey-palette-v1`; ils ne modifient pas les décisions de validation. L’export permet de partager les choix. Le chargement des préférences précède le premier affichage.

Les dégradés des barres et de la courbe sont verticaux, dans le repère du graphique : une même hauteur correspond à une même couleur. Les trois arrêts bas/milieu/haut sont modifiables.

Les PNG de portraits restent des illustrations à couleurs intégrées, pas des composants recolorables. Les icônes de l’interface sont recolorables. Le favicon statique reste un asset de publication.

Pour toute nouvelle couleur : ajouter une entrée identifiée dans le catalogue, puis référencer sa variable. Ne pas ajouter de hex/RGB/HSL dans les composants ni de classe Tailwind de palette fixe. Réutiliser les couleurs sémantiques en priorité. Les bibliothèques tierces ne sont pas réécrites; leurs couleurs de thème (dont blanc/noir) sont reliées aux variables de l’application.
