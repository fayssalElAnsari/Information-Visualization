# Résumer du fonctionnement de preprocess.py

## Pré-traitement

### Etape 1 WARNING : A Déplacer
Création d'une d'un fichier contenant tous les genres disponibles dans la dataFrame song (genre_music_all.txt)

### Etape 2
Création d'un dictionnaire des mots les plus fréquent dans le fichier (genre_music_all.txt), de sorte d'obtenir un dictionnaire avec comme clefs les mots apparaîsant dans les genres ('Rock', 'Hard', 'Metal') et comme valeurs leur fréquence d'apparition.

### Etape 3 : Premier filtrage des dataFrame

Les lignes dupliquées des dataFrame song et album sont tout d'abord supprimé car inutile.
Les relations entre les artistes se basant sur leur collaboration via leur albums commun, les lignes de la dataFrame song ne contenant ni titre d'album, ni titre d'artiste ont été exclues
De même, les lignes de la dataFrame album ne contenant pas le titre de l'album sont supprimées.

### Etape 4: Remplace genre
WARNING : voir si modification concervée

Afin de limité le nombre de genre, le genre des chansons dans la dataFrame song et le genre des albums dans la dataFrame albums est altéré en se basant sur le dictionnaire précédement créer.
Le genre est remplacé par la clé genre la plus commune. Cela permet au genre multi-composé  tel que "Hard-Rock", "Pop Punk" ou encore "Black Metal" d'être remplacé par leur composé le plus commun, ici "rock", "Pop" et "Metal".

La liste des genres retenus est exporté dans un fichier 'list_genre_after_preprocessing.json' .

### Etape 5 : Standardisation

Le nom des artiste et des titres d'albums de la dataFrame song ainsi que le titre des albums dans la dataFrame album est standardisé via la fonction 'standardize_string'.

#### standardize_string(df, column_name)
 Etapes :
- convertit toutes les chaînes de la colonne spécifiée en minuscules
- supprime la ponctuation et d'autres caractères spéciaux, ne laissant que des lettres, des chiffres et des espaces
-  élimine donc tous les nombres de la colonne
- remplacer plusieurs espaces consécutifs par un seul espace
- supprime les espaces en début et en fin de chaque chaîne.

### Etape 6 : retrait des lignes devenu vide
Les lignes de la dataFrame song n'ayant plus ni de titre d'artiste, ni de titre d'album et les lignes de la dataFrame album n'ayant plus de titre d'album après la standardisation sont retirées.
Cela permettra d'éviter à terme de créer des noeuds non-reliés dans la visualisations.

### Etape 7 : replace Na
Les valeurs Na de la dataFrame song sont remplacer par 'None' afin que le futur json découlant soit correctement formater.


## Sortie

### Génération du JSON principale

A partir des données traités, un json est généré dont voici la structure.

{
    ALBUME_NAME_1: {
        album_details:{
            "title", "name", "genre", "publicationDate", "urlAlbum", "urlAllmusic", "urlAmazon", "urlDiscogs", "urlITunes", "urlMusicBrainz", "urlSpotify", "urlWikipedia"
        },
        contributions:{
            artist_name_1:{
                [
                    {"title", "artist", "albumTitle", "album_genre", "preview", "urlAmazon", "urlDeezer", "urlGoEar", "urlHypeMachine", "urlItunes", "urlLastFm", "urlMusicBrainz", "urlPandora", "urlSong", "urlSpotify", "urlWikipedia", "urlYouTube", "urlYouTubeExist"}
                ]
            }
        }
    }
}

Ici :
- 'ALBUME_NAME_1' est le nom d'un album servant de clef, et ayant comme valeur {album_details: {}, contributions:{} }
- 'album_details' à pour valeur un objet contenant des données relatifs à l'abums extraites depuis la dataFrame albums
- 'contributions' à vour valeur un dictionnaire avec pour clefs le noms des artistes participants.
- 'artist_name_1' est le nom d'un artiste servant de clef et ayant comme valeur une liste d'object représentant chacun une musique reliant l'artiste à son album
- l'objet musique contient des informations extraite de la dataFrame song, relatifs à une musique qui lie l'artiste à l'album.

### Dernier filtrage

Sont considérer comme 'absurde' les albums contenant plus de 15 artistes participant.
La visualisation n'ayant pas pour but de mettre en avant des données relatives aux nombres d'albums, ceux-ci sont tout simplement exclut du JSON de sortie précédement généré.