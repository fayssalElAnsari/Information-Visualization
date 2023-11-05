# Graph Visualisation

La visualission a pour objectif de mettre en avant sous forme de graphe les relations de collaborations entre les différents artistes par l'intermédiaire de leurs albums communs.

Le graphe ainsi créer est composé de deux types de noeuds : les noeuds "albums" et les noeuds "artiste, ainsi que deux types de liens : les liens de "participation", et les liens de collaborations


## A propos des noeuds
Les noeuds "artiste" sont des disques rouge représentant chacun un artiste, accompagné de leur nom. WARNING : non cliquable pour l'INSTANT

Les noeuds "albums" sont des carrés représentant chacun un album, accompagné de leur nom. Leur couleur correspond à la légende indiqué sur la gauche de la page. Lorsque cliqué, les noeuds albums font apparaître une toolTip en haut à droite de la fenêtre contenant : 
- le titre de l'album
- l'artiste à l'initiative de l'album
- le genre de 'album
- sa date de publication
- les liens disponibles vers une écoute complète

## A propos des liens

Les liens "participate" sont des traits épais reliant un albums et un artiste. Lorsque que cliqué, les liens "participate" affiche une toolTip coneant le détail de la musique reliant l'album et l'artiste.
- le titre de la musique
- le nom de l'artiste
- le nom de l'album
- le genre de l'album
- un lecteur pour un extrait de la chanson
- des liens vers la musique compète

Les liens "collaboration" sont des traits en pointillés reliant deux artistes participant à un même albums. Lorsque cliqué, une toolTip apparaît et affiche le nom de l'album que les deux artistes ont en commun.

## Filtre et affichage

La visualisation propose un sélecteur permettant à l'utilisateur d'afficher exclusivement un genre spécifique de musique.

La visualalisation propose aussi deux bouttons permetant de cacher / afficher les liens "participate" et "collaboration".   


