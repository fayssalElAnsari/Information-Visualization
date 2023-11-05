import json
import re
from collections import Counter
import pandas as pd
import time

# Enregistrez l'heure de début
start_time = time.time()

def creer_dictionnaire_frequences(nom_fichier):
    """Crée un dictionnaire de fréquences de mots à partir d'un fichier texte."""

    # Ouvrir le fichier et le lire
    with open(nom_fichier, 'r', encoding='utf-8') as fichier:
        texte = fichier.read()

    # Utiliser une expression régulière pour extraire les mots
    mots = re.findall(r'\w+', texte.lower())  # Convertir en minuscules

    # Utiliser Counter pour compter la fréquence de chaque mot
    dictionnaire_frequences = Counter(mots)

    return dictionnaire_frequences

def is_float(text):
    try:
        float_value = float(text)  # Tente de convertir la chaîne en un nombre flottant
        # Si la conversion réussit, c'est un float, donc retourne False
        return True
    except ValueError:
        # Si la conversion échoue (car ce n'est pas un nombre flottant valide), c'est une chaîne, donc retourne True
        return False

def remplacer_genre(row, column_name='album_genre'):
    max_frequency = 0
    genre_modifie = row[column_name]
    
    if isinstance(row[column_name], str):
        for key in dictionnaire:
            if key in row[column_name]:
                if dictionnaire[key] > max_frequency:
                    max_frequency = dictionnaire[key]
                    genre_modifie = key
    else:
        genre_modifie = "Non-défini"
    
    # Considere genre as other if the max frequency is 1
    # if max_frequency <= 1 :
    #     genre_modifie = "other"

# is_float(genre_modifie) or 

    # if the genre is a single caracter, we consider it as a non-defined genre
        # if len(genre_modifie) == 1 or genre_modifie == None or genre_modifie == '':

    if is_float(genre_modifie) or genre_modifie == None or genre_modifie == '':
        genre_modifie = "Non-défini"

    list_genre_after_preprocessing.add(genre_modifie)
    return genre_modifie

def standardize_string(df, column_name):
    df[column_name] = df[column_name].str.lower()
    df[column_name] = df[column_name].str.replace('[^\w\s]', '', regex=True)
    df[column_name] = df[column_name].str.replace('\d+', '', regex=True)
    df[column_name] = df[column_name].str.replace(' +', ' ', regex=True)
    df[column_name] = df[column_name].str.strip()
    return df

def remove_empty_string_row(df, column_name):
    df = df[df[column_name] != '']
    df = df[df[column_name] != ' ']
    return df

################################################# MAIN

dictionnaire = creer_dictionnaire_frequences('preprocessing/genre_music_all.txt')

print(f'Nombre total de genre différents: {len(dictionnaire)}')

# Enregistrez le dictionnaire dans un fichier si nécessaire
with open('data/json/dictionnaire_frequences_genre.json', 'w') as fichier_sortie:
    json.dump(dictionnaire, fichier_sortie)

################################################# INIT DF_SONG
df_song = pd.read_csv('data/csv/wasabi_songs_250k.csv')
print("Origine" ,df_song.shape)

df_song = df_song.drop_duplicates()
print("Drop duplicates" ,df_song.shape)

# Remove all row without albumTitle and artist
df_song = df_song[df_song['albumTitle'].notna()]
print("Drop albumTitle" ,df_song.shape)
df_song = df_song[df_song['artist'].notna()]
print("Drop artist" ,df_song.shape)


################################################## STANDARDIZE DF_SONG GENRE

list_genre_after_preprocessing = set()

df_song['album_genre'] = df_song.apply(remplacer_genre, axis=1)

print("Replace genre" ,df_song.shape)
# Convertir l'ensemble en liste
list_genre_after_preprocessing = list(list_genre_after_preprocessing)
print("Genre kept", list_genre_after_preprocessing)
# Exportez la liste de genre après le prétraitement en JSON
with open('data/json/list_genre_after_preprocessing.json', 'w') as outfile:
    json.dump(list_genre_after_preprocessing, outfile)



################################################### Get the set of artist

list_artist = set()
for index, row in df_song.iterrows():
    list_artist.add(row['artist'])
list_artist = list(list_artist)
# export the list of artist
with open('data/json/list_artist.json', 'w') as outfile:
    json.dump(list_artist, outfile)

#################################################### Standardize DF_SONG artist name
df_song = standardize_string(df_song, 'artist')
print("Artist name standardized")

#################################################### Standardize DF_SONG album title
df_song = standardize_string(df_song, 'albumTitle')
print("Album title standardized")

# Remove all row with albumTitle and artist empty string or space string
df_song = remove_empty_string_row(df_song, 'albumTitle')
df_song = remove_empty_string_row(df_song, 'artist')
print("Drop albumTitle and artist empty string or space string" ,df_song.shape)

# Replace all NaN values with empty strings
df_song = df_song.fillna('None')

###################################### DF ALBUMS

print("DF ALBUMS")

df_album = pd.read_csv('data/csv/wasabi_albums.csv', nrows=250_000)
df_album = df_album.drop_duplicates()
print("Drop duplicates" ,df_album.shape)
df_album = df_album[df_album['title'].notna()]
print("Drop title" ,df_album.shape)

# Standardize album title
df_album = standardize_string(df_album, 'title')
df_album['genre'] = df_album.apply(remplacer_genre, axis=1, column_name='genre')
print("Album title standardized")
df_album = remove_empty_string_row(df_album, 'title')

print("Drop albumTitle empty string or space string" ,df_album.shape)

# Remplacer les valeurs NaN par des 'None'
df_album = df_album.fillna('None')
print("Replace NaN" ,df_album.shape)

# # Changer les genres comme pour les df_song
# df_album['genre'] = df_album.apply(remplacer_genre, axis=1)




### MAIN OUTPUT ###

print("START THE DEAD LOOP")


# Create a dictionary of ALBUMS to ARTISTS to MUSIC DETAILS
albums_to_artists = {}
# Define the list of keys you want to extract from the DataFrame
keys_to_extract = ["title", "artist", "albumTitle", "album_genre", "preview", "urlAmazon", "urlDeezer", "urlGoEar", "urlHypeMachine", "urlItunes", "urlLastFm", "urlMusicBrainz", "urlPandora", "urlSong", "urlSpotify", "urlWikipedia", "urlYouTube", "urlYouTubeExist"]

# Define the list of keys to extract from df_album
album_keys_to_extract = ["title", "name", "genre", "publicationDate", "urlAlbum", "urlAllmusic", "urlAmazon", "urlDiscogs", "urlITunes", "urlMusicBrainz", "urlSpotify", "urlWikipedia"]

# Create a dictionary to store album details to avoid redundant access to df_album
album_details_cache = {}

# Loop through the DataFrame
for index, row in df_song.iterrows():
    album_title = row["albumTitle"]
    artist = row["artist"]
    music_details = {key: row[key] for key in keys_to_extract}  # Extract specific keys from the row
    # If the album is not in the dictionary, create it
    if album_title not in albums_to_artists:
        albums_to_artists[album_title] = {"album_details": {}, "contributions": {}}

    # Check if album details are in the cache, otherwise, access df_album
    if album_title not in album_details_cache:
        album_details = df_album[df_album['title'] == album_title].to_dict('records')[0]
        album_details = {key: album_details[key] for key in album_keys_to_extract}
        album_details_cache[album_title] = album_details
    else:
        album_details = album_details_cache[album_title]

    albums_to_artists[album_title]["album_details"] = album_details

    # If the artist is not in the album, create an entry for the artist
    if artist not in albums_to_artists[album_title]["contributions"]:
        albums_to_artists[album_title]["contributions"][artist] = []
    # Add the music details to the artist's list in the album
    albums_to_artists[album_title]["contributions"][artist].append(music_details)


print("ALMOST DONE")

#  Create a dictionnaary of albums to number of artists
albums_to_number_of_artists = {}
# Loop through the dictionary of albums to artists to music details
for album_title in albums_to_artists:
    # Create an entry for the album
    albums_to_number_of_artists[album_title] = len(albums_to_artists[album_title]["contributions"])

# Exlude all albums with more than 15 artists
for album_title in list(albums_to_number_of_artists.keys()):
    if albums_to_number_of_artists[album_title] > 15:
        del albums_to_number_of_artists[album_title]
        del albums_to_artists[album_title]

print("Number of albums with more than 15 artists: ", len(albums_to_number_of_artists))

print("DEAD LOOP DONE")
print("Export to JSON")

# Export to json
with open('data/json/albums_to_number_of_artists.json', 'w') as outfile:
    json.dump(albums_to_number_of_artists, outfile)

# export to json
with open('data/json/albums_to_artists_to_music_details.json', 'w') as outfile:
    json.dump(albums_to_artists, outfile)

# Export to csv
# df_song.to_csv('data/csv/wasabi_songs_250k_standardized.csv', index=False)


# Enregistrez l'heure de fin
end_time = time.time()

# Calculez la durée d'exécution en soustrayant l'heure de fin de l'heure de début
execution_time = end_time - start_time

print(f"Le programme a mis {round(execution_time)} secondes à s'exécuter.")