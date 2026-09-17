# Hockey Club Lab — recherche et piste avancée

17 septembre 2026. Document de travail : aucune décision de remplacer les sept attributs.

## Ce qui a été consulté

- [NHL Stats](https://www.nhl.com/stats) : référence officielle pour les tableaux de production.
- [NHL EDGE](https://www.nhl.com/news/topic/nhl-edge/nhl-edge-site-new-look-has-advanced-statistics-for-everybody) : résumés, recherche, comparaison et approfondissement progressif.
- [MoneyPuck, glossaire](https://moneypuck.com/glossary.htm) : mesures individuelles, sur glace, relatives et gardiens.
- [MoneyPuck, méthode](https://moneypuck.com/about.htm) : construction des probabilités de but, ajustements et finition.
- [Evolving-Hockey, définitions](https://evolving-hockey.com/glossary/general-terms/) : situations, taux, tentatives et limites d’interprétation.
- [Evolving-Hockey, GAR](https://evolving-hockey.com/glossary/goals-above-replacement/) : contribution globale et niveau de remplacement.
- [MoneyPuck, données](https://moneypuck.com/data.htm) : formats disponibles et conditions d’usage.

Les pages détaillées de Natural Stat Trick et Hockey-Reference n’étaient pas accessibles. Nous ne leur attribuons donc pas de méthode vérifiée ni d’analyse visuelle. Aucun tableau de résultats NHL n’a été copié et aucune donnée réelle n’est injectée dans le prototype.

## Définitions utiles

Les xG additionnent des probabilités de but associées aux occasions. Distance, angle, type de tir et événements précédents font partie des variables décrites par MoneyPuck. Le modèle standard et l’ajustement au talent de finition sont distincts. Une différence buts moins xG n’est donc pas automatiquement une mesure stable du talent. Source : [méthode MoneyPuck](https://moneypuck.com/about.htm).

| Mesure | Calcul | Lecture |
| --- | --- | --- |
| P/60 | (B + A) × 60 / minutes | Production individuelle à temps égal |
| i xG/60 | i xG × 60 / minutes | Occasions propres au tireur |
| xGF % | 100 × xGF / (xGF + xGA) | Part du danger attendu avec le joueur sur glace |
| CF % | 100 × CF / (CF + CA) | Part des tentatives, incluant les tirs bloqués |
| FF % | 100 × FF / (FF + FA) | Part des tentatives non bloquées |
| xGA/60 | xGA × 60 / minutes | Danger concédé par le groupe |
| B − i xG | Buts − buts attendus individuels | Écart de finition observé |
| xGF % relatif | xGF % sur glace − hors glace | Différence en points de pourcentage |

Source : [glossaire MoneyPuck](https://moneypuck.com/glossary.htm). Toutes ces valeurs doivent utiliser la même période et la même situation de jeu.

Les mesures sur glace incluent les événements des autres joueurs présents. Les modèles xG diffèrent entre fournisseurs; les chances dangereuses ne possèdent pas une définition universelle. Les taux à faible temps de jeu sont instables. Source : [Evolving-Hockey](https://evolving-hockey.com/glossary/general-terms/).

Le GAR regroupe différentes contributions, notamment offensive, défensive, unités spéciales et pénalités, par rapport à un niveau de remplacement. Le WAR exprime la contribution en victoires; sa conversion dépend du modèle. Ce n’est pas une simple addition de points ni une note à inventer pour chaque joueur. Source : [GAR / WAR](https://evolving-hockey.com/glossary/goals-above-replacement/).

Pour les gardiens, GSAx = buts attendus contre − buts accordés. Cette lecture nécessite une fiche distincte de celle des attaquants. Source : [MoneyPuck](https://moneypuck.com/glossary.htm).

## Ce que nous proposons de tester — conception originale

### A. Des capacités qui produisent des observations

On garde maniement, tir, puissance, patinage, IQ, créativité et cœur. Ces paramètres influencent des probabilités dans la simulation. Après un bloc de saison, on observe les résultats classiques et avancés. Un joueur peut progresser techniquement sans produire immédiatement davantage de points.

Intérêt à tester : est-ce que cela aide le DG à distinguer une mauvaise séquence d’un mauvais développement? Risque : trop de chiffres pour une décision simple. La carte ne devrait pas porter tout le modèle.

### B. Des observations comme outil de recrutement

Le DG peut voir deux joueurs de production comparable mais aux occasions très différentes. Il cherche qui convient à ses partenaires et au rôle disponible. Les capacités pourraient devenir partiellement incertaines, mais cette idée n’est pas implémentée ni acceptée.

Intérêt à tester : peut-on découvrir un joueur intéressant avant qu’il ne devienne cher? Risque : transformer le jeu en classement automatique sur une colonne. Il faudra conserver des compromis de rôle, santé, personnalité, contrat et culture.

### C. Des profils statistiques comme langage principal

Une autre version pourrait parler de création d’occasions, finition et limitation du danger plutôt que montrer autant d’attributs. Attention à la distinction : le profil latent est un paramètre du moteur; la statistique publiée est le résultat d’une période. Donner directement « 58 % xGF » comme qualité innée ferait disparaître une partie de l’effet des partenaires.

Intérêt à tester : est-ce plus concret qu’une note de créativité? Risque : le joueur semble changer de personnalité sportive chaque semaine à cause du bruit statistique.

Aucune de ces trois pistes n’est retenue. Le labo permet de les discuter côte à côte.

## Combinaisons et chimie

Hypothèse de simulation : les attributs déterminent des tendances individuelles; les partenaires modifient la fréquence et la qualité des séquences; la culture agit sur le développement et les réactions. Les observations sont générées ensuite. La chimie ne doit pas être assimilée à xGF % : un trio très talentueux peut bien performer malgré une mauvaise entente.

Pour comparer un duo ensemble et séparément, il faudrait conserver les minutes et les événements communs. Ne pas additionner les xG individuels « sur glace » de trois joueurs : le même tir peut déjà être compté pour les trois. Un historique de combinaisons doit donc avoir ses propres événements ou agrégats.

Test envisagé : changer un seul partenaire, garder un rôle comparable, puis observer plusieurs blocs. Nous ne promettons pas de causalité à partir d’une simple hausse de résultat. Blessures, adversaires, unités spéciales et utilisation peuvent aussi changer.

## Contrats et développement

Une meilleure production par minute pourrait aider à repérer un joueur sous-utilisé. Cela ne suffit pas à fixer un salaire. Dans une future version, le marché pourrait réagir à la production visible alors que le DG examine également le contexte. C’est une possibilité de jeu, pas une description d’un modèle de marché réel.

Le développement reste séparé du rendement : apprentissage, âge, santé, potentiel, personnalité et organisation. Les stats avancées seraient une fenêtre sur les effets. Il faut éviter une boucle où une bonne séquence augmente automatiquement le talent, qui produit une autre bonne séquence sans limite.

## Présentation et densité

Adaptation retenue pour le gym :

1. Carte : identité, position, âge, buts/passes/points, attributs compacts, salaire et santé.
2. Fiche : contrat, potentiel, personnalité, santé et observations détaillées.
3. Tableau : comparaison entre joueurs avec tri par chaque colonne.
4. Recherche : définitions, sources et hypothèses repliables.

Le numéro devient secondaire. Les couleurs restent des repères décoratifs stables. Elles ne codent aucune rareté, force ou position. Si on choisit un sens plus tard, il devra être visible et constant.

Les tris numériques favorisent la valeur utile : xGA/60 et salaire croissants, production décroissante. Âge croissant signifie « plus jeune », sans déclarer qu’un jeune est meilleur. Les colonnes textuelles sont alphabétiques. Un second clic conserve cet ordre plutôt que placer volontairement la moins bonne valeur en premier.

## Ce que le prototype calcule réellement

Les six joueurs ont chacun un petit jeu d’observations fictives à cinq contre cinq : minutes, buts, passes, tirs, i xG, CF/CA, FF/FA, xGF/xGA et pourcentage hors glace. Les huit mesures visibles sont dérivées de ces observations, sans aléatoire au rendu.

Les cartes conservent leur production toutes situations. Le labo affiche explicitement cinq contre cinq. Les deux séries ne sont donc pas censées avoir les mêmes totaux. Toutes les fiches utilisent 24 matchs fictifs; cela n’est pas une connexion à une saison réelle.

Modifier une capacité ou permuter les joueurs ne régénère pas leur passé statistique. Aucun moteur de match, apprentissage du potentiel, modèle xG entraîné, estimation GAR ou simulation de chimie n’a été ajouté. Le filtre de minutes sert à tester la lecture d’un échantillon, pas à certifier la fiabilité d’un seuil particulier.

## Données et mise en œuvre future

Une future simulation pourrait enregistrer, pour chaque événement, période, situation numérique, joueurs présents, tireur, qualité d’occasion, résultat et temps de glace. Le moteur doit avoir une source de vérité unique; les tableaux calculent leurs ratios à partir d’elle. Prévoir « indisponible » si le dénominateur est nul.

Les jeux de données MoneyPuck comprennent patineurs, gardiens, combinaisons, équipes et tirs. La page indique un usage gratuit non commercial et des conditions distinctes pour d’autres usages. Une exploitation commerciale nécessiterait de vérifier l’autorisation; consulter une définition ne nous autorise pas à republier leur base. Source : [MoneyPuck — données](https://moneypuck.com/data.htm).

Pour ce jeu fictif, on peut concevoir nos propres probabilités et produire nos propres observations. Avant de pousser plus loin : comparer plusieurs joueurs moyens dans plusieurs rôles, regarder si les décisions restent compréhensibles et tester si le joueur ressent de l’attachement plutôt qu’une obligation d’optimiser un tableur.
