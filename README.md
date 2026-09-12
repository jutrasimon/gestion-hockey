# Hockey Club : gym d’interface

Prototype d’interface autonome, données fictives. Aucun moteur de simulation, serveur multijoueur ou calcul de chimie.

## Stack testée

- React 19 et TypeScript : interface responsive basée sur des composants DOM.
- Motion 13 : transitions de fiches, radar animé, boutons à ressort, respect de la préférence de réduction des animations.
- @dnd-kit/core 6 : déplacement des cartes avec capteurs pointeur et clavier; poignée dédiée au tactile. Un bouton « Changer de place » permet aussi d’effectuer le même échange sans glisser.
- Radix UI / composants shadcn : sliders, onglets et tableaux.
- Tailwind CSS et CSS : thème propre au gym.
- Vinext / Vite : compilation et hébergement Sites. Ce choix de démonstration ne verrouille pas l’architecture finale du jeu.

Documentation officielle : https://react.dev/ ; https://motion.dev/ ; https://docs.dndkit.com/ ; https://www.radix-ui.com/primitives/docs/overview/introduction

## Manipulations

1. Faire glisser une carte par sa poignée vers une autre place : les joueurs sont échangés.
2. Cliquer sur un joueur pour voir sa fiche. Sur mobile, la page descend vers la fiche.
3. Modifier ses attributs : le radar suit, avec une échelle graphique ajustée par paliers. Aucun plafond d’attribut n’est appliqué; zéro est la borne inférieure.
4. Ajuster les deux axes de personnalité. Ces valeurs modifient seulement la fiche, sans effets sportifs simulés.
5. Effectif : trier par points ou salaire, sélectionner une fiche.
6. Atelier : modifier arrondi et intensité des effets, essayer le bouton.
7. Ajuster le plafond salarial fictif et voir le dépassement calculé pour les six joueurs.
8. Réinitialiser pour restaurer toutes les données de départ.

Le budget couvre les six cartes, banc compris. Le changement d’alignement ne change pas la masse salariale.
Les positions restent libres dans ce gym; les règles d’admissibilité seront définies avec le gameplay.
Toutes les modifications sont en mémoire et disparaissent au rechargement.

## Validation

Compilation locale et vérification TypeScript avant publication. Aucun essai dans un navigateur réel effectué pour cette livraison. Tester le tactile et le clavier sur les appareils cibles avant de retenir définitivement la stack.

Un outil WebMCP facultatif select_hockey_player est enregistré uniquement si document.modelContext est disponible; il utilise la sélection de fiche existante. La validation dans un contexte WebMCP compatible n’était pas disponible.
