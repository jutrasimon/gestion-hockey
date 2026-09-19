# Système de couleurs

## Règle

**Toutes les couleurs du produit passent par des variables globales.** Les composants ne doivent pas définir leurs propres couleurs métier.

Variables principales dans `:root` :

```css
--bg
--bg-2
--panel
--panel-2
--text
--muted
--line
--accent
--accent-2
--danger
--warning
--good
```

Le thème clair redéfinit le même ensemble sous `body.light`.

## Usage

- `--accent` : action principale / valeur positive / identité.
- `--accent-2` : seconde extrémité des dégradés.
- `--good` : santé / succès.
- `--warning` : mise en garde, favori.
- `--danger` : blessure / risque / perte.
- `--line` : séparateurs et contours.

## Dégradés de statistiques

Le remplissage des barres est vertical :

```css
background: linear-gradient(180deg, var(--accent), var(--accent-2));
```

L'intensité des cartes de statistiques peut dépendre d'une variable numérique (`--v`) dérivée de la valeur du joueur.
