# VISUALISATION DE L'ENSEMBLE DE DONNÉES WASABI AVEC 4 VUES DIFFÉRENTES EN D3JS

## APERÇU DU PROJET

Dans ce projet, nous utiliserons le corpus WASABI

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

**Visualisation** : Un graphique à barres où chaque barre représente un genre et la hauteur de la barre indique le nombre d'albums de ce genre.  
**Scénario** : Un analyste de l'industrie musicale souhaite comprendre la distribution des albums à travers différents genres.  
**Utile pour** : Les producteurs de musique, les maisons de disques ou les chercheurs du marché.  
**Responsable** : Fayssal EL ANSARI  
**Documentation** : https://observablehq.com/@d3/histogram/2?intent=fork

### 2. ...

### 3. ...

### 4. ...

## ENSEMBLE DE DONNÉES

- WASABI : https://github.com/micbuffa/WasabiDataset
