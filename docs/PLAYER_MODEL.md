# Modèle de joueur

## Attributs principaux

Les attributs partent d'une échelle pratique autour de 1 à 15. **10 n'est pas un plafond** : les valeurs 11 à 15 représentent des joueurs exceptionnels.

| Code | Attribut | Rôle |
|---|---|---|
| MAN | Maniement | Contrôle de la rondelle, exécution avec le disque |
| TIR | Tir | Qualité, danger et efficacité du tir |
| PUI | Puissance | Force physique, impact et présence |
| PAT | Patinage | Mobilité, vitesse, accélération |
| IQ | Lecture de jeu | Anticipation, décisions, placement |
| CRÉ | Créativité | Capacité à créer des options et des jeux inattendus |
| CŒ | Cœur | Résilience, constance, implication |

## Informations de profil

- Nom, numéro, âge et position.
- Taille et poids.
- Type de joueur.
- Saison dans la ligue et saisons avec l'équipe.
- Contrat annuel et années restantes.
- État de santé et historique des blessures.
- Potentiel de développement.
- Traits.

## Traits

Le prototype prévoit **2 traits par joueur au départ**, dans un système extensible. Les traits sont des qualificatifs mécaniques et ne remplacent pas les attributs chiffrés.

Exemples : `Sniper`, `Passeuse`, `Physique`, `Collectif`, `Greedy`.

## Culture / chimie

L'axe principal de culture est :

**Conformiste ↔ Anarchiste**

Une statistique séparée décrit la facilité générale à jouer avec ce joueur. Elle ne doit pas être confondue avec la culture.

## Développement

Le potentiel est volontairement granulaire. Les interfaces doivent pouvoir représenter une évolution lente, des plateaux et des profils atypiques sans supposer qu'un joueur progresse toujours vers une note maximale fixe.
