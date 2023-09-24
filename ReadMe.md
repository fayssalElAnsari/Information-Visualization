# VISUALIZATION OF WASABI DATASET USING 4 DIFFERENT VIEWS IN D3JS

## PROJECT OVERVIEW

In this project we'll be using the WASABI dataset

## COLLABORATORS

- Fayssal EL ANSARI
- Milena KOSTOV
- ...
-

## PIPELINE

Our pipeline will follow these basic steps:

1. Load the data from WASABI dataset
   - There are 3 different tables: `albums` , `artists` and `songs`
2. Pre-prsocess the data
   - This is a crucial step which we'll be updated as we discover the data as needed.
     - starting by checking for empty field values
     - wrong/unvalid field values
     - ...

## VISUALIZATION

This is the goal of this project, we'll be visualizing the data in four different methods. Each method is catered towards a certain use case. There are no real constraints besides having a view that makes sense with respect to the user that we'll be manipulating it.

### Bar Chart or Histogram of Albums by Genre:

- **Visualization**: A bar chart where each bar represents a genre and the height of the bar represents the number of albums in that genre.
- **Scenario**: A music industry analyst wants to understand the distribution of albums across different genres.
- **Beneficial for**: Music producers, record companies, or market researchers.
- **Assignee**: Fayssal EL ANSARI
- **doc**: https://observablehq.com/@d3/histogram/2?intent=fork


### Tables pour afficher les informations sur les artistes, les albums et les titres

- **Visualization** : une table qui affiche des informations soit sur les artistes soit les albums soit les titres. L'utilisateur peut choisir les attributs qu'il souhaite faire apparaitre, filtrer les donnees par rapport a une date. Chaque ligne représente un artiste, un album ou un titre.
- **Scenario**: Un professionnel de la musique souhaite etudier les tendances selon differents filtres (genre musical, annee de publication, etc...)
- **Interets pour**: professionnels de l'industrie musical
- **Assignee**: Milena KOSTOV

## DATASET

WASABI: https://github.com/micbuffa/WasabiDataset
