# VISUALISATION DE L'ENSEMBLE DE DONNÉES WASABI AVEC 4 VUES DIFFÉRENTES EN D3JS

Live Demo: https://fayssalelansari.github.io/Information-Visualization/

## APERÇU DU PROJET

Dans ce projet, nous utiliserons le corpus WASABI

https://www.kaggle.com/datasets/fayssalelansari/wasabi-song-corpus
https://colab.research.google.com/drive/1wp4YxLdenl4VCbzRV6lFYP3J0p6-uNFJ?authuser=3

## GROUPE

HarmoniViz

## COLLABORATEURS

    * Fayssal EL ANSARI
    * Miléna KOSTOV
    * Lucas LYON
    * Mohamed ELYSALEM

## INSTRUCTIONS

Pour installer les dependences:

```sh
cd site
npm install
```

Pour lancer le site il suffit d'executer (a partir du dossier `site`):

```sh
npm run start

```

## PIPELINE

Notre processus suivra ces étapes de base :

1. Charger les données de l'ensemble WASABI
   - Il y a 3 tables différentes : albums, artists et songs
2. Prétraitement des données
   - C'est une étape cruciale qui sera mise à jour à mesure que nous découvrons les données.
     - en commençant par vérifier les valeurs de champ vides
     - les valeurs de champ incorrectes ou non valides
       ...

## VISUALISATION

C'est l'objectif de ce projet. Nous visualiserons les données selon quatre méthodes différentes. Chaque méthode est adaptée à un certain cas d'utilisation. Il n'y a pas de contraintes réelles, sauf que chaque vue devrais etre pertinente pour son cas d'utilisation.

### RESUME DE PROPOSITION

- Types de Données Visualisées

  - **Compartimentage de cercles** pour afficher des informations selon differents niveaux de visualisation : le genre, les artistes, les albums et les titres.

  - **Graphes** pour afficher les collaborations entre les artistes (les artistes sont représentés par
    des nœuds et les relations entre les artistes par des arêtes).

  - **Listes/Clusters/Sets** pour regrouper les artistes par genre musical, regrouper les albums par
    genre musical et date de publication.

  - **histogrammes** où chaque barre représente un champs d'un table du corpus et la hauteur de la barre indique un critere par rapport au champ choisis. Les deux axes de l'histogramme peuvent être modifiés pour afficher d'autres champs, par exemple, le genre de la music ou l'année sur l'axe des abscisses. Et le nombre de music sur l'axe des ordonnées.

- Identification des utilisateurs visés

  - Les professionnels de l'industrie musicale qui ont besoin d'analyses sur les tendances musicales
    et les collaborations passées entre différents artistes.
  - Les consommateurs intéressés à découvrir de nouveaux artistes qui ont des similitudes avec
    leurs artistes préférés.

- Liste de tâches supportées par la visualisation
  - Recherche d'artistes : Les utilisateurs peuvent effectuer des recherches d'artistes en utilisant
    différents filtres tels que le genre musical et l'année de publication.
  - Exploration des collaborations : Les utilisateurs peuvent découvrir quel artiste a déjà fait une
    collaboration par le passé et avec qui. Cela peut permettre à des amateurs de musique de découvrir
    de nouveaux artistes.
  - Analyse des tendances musicales : La visualisation permet aux utilisateurs d'analyser les
    tendances musicales en regroupant les artistes par genre musical ou en examinant les albums par
    date de sortie par exemple.

### DETAILS DE PROPOSITION

### 1. Carte du Monde des Albums par Pays :

- **Path**: `http://127.0.0.1:8080/map.html`
- **Visualisation** : Une carte du monde où chaque pays est coloré en fonction du nombre d'albums associés. Les pays sont groupés par le nombre d'albums et lorsqu’on passe la souris sur un pays, toutes les informations correspondantes sont affichées.
- **Actions possibles** :  
   **Filtre Temporel** : Permet de visualiser les données d'albums pour des années spécifiques, grâce à une ligne de temps située en dessous de la carte.
  Activation/Désactivation de la Ligne de Temps : Un bouton permet d'activer ou de désactiver la ligne de temps. Lorsque la ligne de temps est désactivée, les données sont affichées pour toute la période; sinon, elles sont groupées par année.
  Zoomer et Explorer : Agrandir des sections spécifiques de la carte pour une analyse détaillée des pays.
  Cliquer sur un Pays : Afficher la liste des albums de ce pays, avec des liens vers des détails supplémentaires.
- **Scénario** : Un chercheur dans le domaine de la musique souhaite comprendre la distribution mondiale des albums, en analysant les tendances par pays et au fil du temps.
- **Utile pour** : Les analystes de l'industrie musicale, les maisons de disques, les producteurs de musique et les chercheurs du marché.
- **Responsable** : Fayssal EL ANSARI
- **Documentation** :

  https://d3js.org/d3-geo  
   https://www.d3indepth.com/geographic/  
   https://d3-graph-gallery.com/backgroundmap.html

- TODO
- [x] add tooltip to show total number of albums per country
- [x] add a timeline underneath the map that could be activated or deactivated (or animated) for each year
- [x] add table containing other info visible for each country on hover
- [x] add filters for which info to keep
- [x] optimize for speed
- [x] add pagination to info table
- [ ] add a legend for color intervals and other elements on the map
- [ ] low priority
  - [ ] add color selection palette
  - [ ] add col selection including number of limiters (7 domains by default)
- [ ] ...

### 2. Compartimentage de cercles pour representer la hierarchisation genre, artiste, album et titre

- **Visualization** : Un comportimentage de cercles ou chaque cercle montre un niveau different (genre, artiste, album, titre).
- **Actions possibles**:
  - Zoom : possibilite de zoomer sur une donnée afin d'afficher des informations plus precises (par exemple, en cliquant sur un artiste on zoom sur les albums et les titres associes)
  - Navigation : passage entre differents niveaux de lecture.
  - Sélection: Les utilisateurs peuvent sélectionner un genre, un artiste afin d'afficher les informations concernant un groupe bien precis. Par exemple, en cliquant sur un artiste on affiche ses albums et les titres contenus dans ces derniers.
- **Scénario**: Un professionnel de la musique / un amateur de musique souhaite obtenir trouver un nouveau artiste et ses titres pour un genre donné
- **Utile pour** : professionnels de l'industrie musical / un amateur de musique
- **Responsable**: Milena KOSTOV
- **Documentation** :

  https://www.anychart.com/products/anychart/gallery/Circle_Packing/100_Richest_People,_According_to_Forbes.php

  https://d3-graph-gallery.com/circularpacking.html

### 3. Graphes pour afficher les collaborations entre les artistes

- **Visualisation** : Graphes où les nœuds représentent les artistes et les arêtes représentent les collaborations entre eux. Chaque nœud peut être coloré selon le genre musical de l'artiste, offrant une vue d'ensemble des collaborations inter-genres.
- **Actions possibles**:
  - Zoom et Pan: Les utilisateurs peuvent zoomer sur une partie spécifique du graphe pour voir des détails ou se déplacer dans le graphe.
  - Sélection: En cliquant sur un nœud (artiste), l'utilisateur peut voir les détails de cet artiste et de ses collaborations.
  - Filtrage: Possibilité de filtrer le graphe en fonction de certains critères, par exemple, montrer uniquement les artistes d'un certain genre musical ou ayant collaboré pendant une certaine période.
  - Recherche: Les utilisateurs peuvent rechercher un artiste spécifique et le mettre en évidence dans le graphe.
- **Scénario** : Un professionnel de la musique souhaite explorer les collaborations entre artistes pour identifier des tendances ou des collaborations inhabituelles.
- **Utile pour** : Agents artistiques, chercheurs du marché, et fans de musique voulant découvrir des collaborations inattendues.  
  **Responsable** : Lucas LYON
- **Documentation** : [Lien vers la Documentation Pertinente]

### 4. Listes/Clusters/Sets pour regrouper les artistes

- **Visualisation** : Des clusters visuels qui regroupent les artistes par genre musical ou par décennie d'activité. Chaque cluster peut être interactif, permettant aux utilisateurs de plonger plus profondément dans les détails.
- **Actions possibles**:
  - Exploration: Les utilisateurs peuvent cliquer sur un cluster pour voir les détails des artistes qui le composent.
  - Filtrage: Les utilisateurs peuvent filtrer les clusters en fonction de critères spécifiques, comme montrer uniquement les clusters d'artistes actifs pendant une certaine décennie.
  - Recherche: Les utilisateurs peuvent rechercher un artiste ou un genre musical spécifique pour identifier rapidement le cluster approprié.
  - Tri: Possibilité de trier les clusters en fonction de la taille, de la popularité des artistes, etc.
- **Scénario** : Un historien de la musique souhaite étudier l'évolution des genres musicaux à travers les décennies et identifier les artistes clés de chaque période.
- **Utile pour** : Historiens de la musique, éducateurs, et passionnés de musique.  
  **Responsable** : Mohamed ELYSALEM
- **Documentation** : [Lien vers la Documentation Pertinente]

## ENSEMBLE DE DONNÉES

- WASABI : https://github.com/micbuffa/WasabiDataset

### LICENSE
