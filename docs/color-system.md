# Système de couleurs

`app/palette-masters.json` contient les 8 couleurs maîtresses de l’interface et les 6 couleurs des joueurs. Ce sont les seules couleurs littérales de l’application. `app/palette.json` contient les nuances dérivées via des couleurs HSL relatives : changer une maîtresse fait suivre ses nuances, sans régler chaque composant.

Le gym expose deux petits groupes : Interface et Joueurs. Modification immédiate, restauration individuelle/globale, import/export JSON. Les préférences v2 sont locales (`hockey-palette-v2`) et chargées avant affichage. L’ancienne palette v1 est conservée en stockage mais n’est plus appliquée, afin que les anciennes surcharges ne cassent pas les liens entre couleurs.

Les graphes utilisent une échelle verticale de couleur. Les icônes, effets, ombres et transparences consomment aussi la palette. Les particules canvas résolvent les variables via une propriété CSS calculée avant chaque explosion : CanvasRenderingContext2D ne résout pas lui-même `var()`.

Pour ajouter une couleur, créer une dérivation dans le catalogue et consommer sa variable; aucune nouvelle couleur littérale dans un composant. Les portraits PNG et le favicon statique conservent leurs couleurs intégrées.
