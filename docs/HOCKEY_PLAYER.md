# Hockey Player : gym de conception

Accès : UI Gym → Hockey Player, ou `/?gym=player`. Template neutre indépendant de l’équipe. Les outils UI existants sont réutilisés : carte recto/verso, radar, sliders, tableaux, fiche flottante, bibliothèque d’interactions, atelier boutons et juice.

## Inventaire

Sept attributs sur15 : Maniement, Tir, Puissance, Patinage, IQ hockey, Défense, Cœur. Catalogues issus de la source joueurs : quatre types, trois styles, trois traits, six potentiels. Positions actuelles AG/C/AD seulement, pas encore de modèle défenseur/gardien.

Les catégories disposent chacune de sept modificateurs éditables entre −5 et +5, tous nuls par défaut. Attribut effectif = base + effets actifs, borné de1 à15. Ceci est un outil pour essayer une règle, pas une validation de ce que doit faire chaque type. Les règles expérimentées n’affectent pas les autres gyms.

Mesures proposées du joueur : globale = moyenne des sept attributs; création = moyenne maniement/IQ; finition = tir; récupération = (2défense + puissance + cœur)/4; mobilité = patinage. Aucun hasard. Les formules sont affichées. Comparaison avec une référence mémorisée dans la session.

Identité, ancienneté, taille/poids, deux axes de personnalité, santé, durée d’absence, énergie, confiance, moral et contrat sont éditables. Hors engagement salarial (salaire×durée), leurs effets restent à définir et sont explicitement indiqués sans effet mécanique.

Deux saisons de démonstration éditables : matchs, buts, passes, points calculés. Douze observations à5contre5 éditables et huit ratios dérivés. Aucun lien causal inventé entre attributs et statistiques historiques. Dénominateurs nuls : non calculable.

## Conservation

Brouillon local version1 sauvegardé après400ms et à la fermeture de page. JSON import/export validé. Modèle neutre et retour à la référence pour essayer sans toucher au roster. La référence de comparaison est propre à la visite; au rechargement, le brouillon enregistré devient la référence.

## Notes de conception de l’utilisateur

- Format envisagé : **3 trios = 9 titulaires**.
- Possibilité de **3 remplaçants, un par trio**, donc **12 joueurs**. Hypothèse à valider, pas une règle déployée sur l’effectif actuel.
- La note du trio doit se recalculer selon les trois joueurs **et leur chimie**, mais rester **déterministe** : à composition et état identiques, aucun hasard dans sa valeur.
- Commencer par concevoir complètement le joueur avant de définir la formule de chimie du trio.
