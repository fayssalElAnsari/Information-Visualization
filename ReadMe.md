# VISUALISATION DE L'ENSEMBLE DE DONNÉES WASABI AVEC 4 VUES DIFFÉRENTES EN D3JS

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

  - **Tables** pour afficher des informations sur les artistes (nom, genre musical, date de naissance, etc.),
    les albums (titre, date de sortie, classements, etc.) et les titres (artiste, durée, etc.).
    Chaque ligne représente un artiste, un album ou un titre.

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

### 1. Histogramme ou Graphique à Barres des Albums par Genre :

- **Visualisation** : Un graphique à barres où chaque barre représente un genre et la hauteur de la barre indique le nombre d'albums de ce genre.
- **Actions possibles**:
  - Un filtre par période : Voir la distribution des genres musicaux pour des décennies spécifiques.
  - Zoomer et explorer : Agrandir des sections spécifiques de l'histogramme pour une analyse détaillée.
  - Cliquer sur une barre : Afficher la liste des albums de ce genre, avec des liens vers des détails supplémentaires.
  - Comparer : Sélectionner plusieurs genres pour les comparer côte à côte.
- **Scénario** : Un analyste de l'industrie musicale souhaite comprendre la distribution des albums à travers différents genres.
- **Utile pour** : Les producteurs de musique, les maisons de disques ou les chercheurs du marché.
- **Responsable** : Fayssal EL ANSARI
- **Documentation** : https://observablehq.com/@d3/histogram/2?intent=fork

### 2. Tables pour afficher les informations sur les artistes, les albums et les titres

- **Visualization** : une table qui affiche des informations soit sur les artistes soit les albums soit les titres. L'utilisateur peut choisir les attributs qu'il souhaite faire apparaitre, filtrer les donnees par rapport a une date. Chaque ligne représente un artiste, un album ou un titre.
- **Actions possibles**:
  - Filtrage: Les utilisateurs peuvent filtrer les tables par différents critères, tels que le genre musical, l'année de publication, le nom de l'artiste, etc.
  - Tri: Possibilité de trier les données par colonne, par exemple, par date de sortie d'album, par popularité, par nom d'artiste, etc.
  - Sélection: Les utilisateurs peuvent sélectionner des entrées spécifiques pour obtenir des détails supplémentaires ou pour les comparer.
- **Scénario**: Un professionnel de la musique souhaite etudier les tendances selon differents filtres (genre musical, annee de publication, etc...)
- **Utile pour** : professionnels de l'industrie musical
- **Responsable**: Milena KOSTOV

### 3. Graphes pour afficher les collaborations entre les artistes

WARNING : ID unique par musique --> collaboration abscente => pas de lien possible

- **Visualisation** : Graphes où les nœuds représentent les artistes et les arêtes représentent les collaborations entre eux. Chaque nœud peut être coloré selon le genre musical de l'artiste, offrant une vue d'ensemble des collaborations inter-genres.
- **Actions possibles**:
  - Zoom et Pan: Les utilisateurs peuvent zoomer sur une partie spécifique du graphe pour voir des détails ou se déplacer dans le graphe.
  - Sélection: En cliquant sur un nœud (artiste), l'utilisateur peut voir les détails de cet artiste et de ses collaborations.
  - Filtrage: Possibilité de filtrer le graphe en fonction de certains critères, par exemple, montrer uniquement les artistes d'un certain genre musical ou ayant collaboré pendant une certaine période.
  - Recherche: Les utilisateurs peuvent rechercher un artiste spécifique et le mettre en évidence dans le graphe.
- **Scénario** : Un professionnel de la musique souhaite explorer les collaborations entre artistes pour identifier des tendances ou des collaborations inhabituelles.
- **Utile pour** : Agents artistiques, chercheurs du marché, et fans de musique voulant découvrir des collaborations inattendues.  
  **Responsable** : Lucas LYON

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

## ENSEMBLE DE DONNÉES

- WASABI : https://github.com/micbuffa/WasabiDataset

### LICENSE
