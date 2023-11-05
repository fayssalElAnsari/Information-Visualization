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


    # Standardize the string

    # print("Texte avant standardize", texte)
    texte = texte.lower()
    texte = re.sub('[^\w\s]', '', texte)
    texte = re.sub('\d+', '', texte)
    texte = re.sub(' +', ' ', texte)
    texte = texte.strip()
    texte = texte.replace('-', ' ')
    # print("Texte après standardize", texte)

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

first_run_remplacer_genre = True

def remplacer_genre(row, column_name='album_genre'):
    max_frequency = 0
    genre = row[column_name]

    if isinstance(genre, str):
        for key_genre in dictionnaire:
            if key_genre in genre:
                if dictionnaire[key_genre] > max_frequency:
                    max_frequency = dictionnaire[key_genre]
                    genre = key_genre

            elif genre in key_genre:
                if dictionnaire[key_genre] > max_frequency:
                    max_frequency = dictionnaire[key_genre]
                    genre = key_genre
    else:
        genre = "Non-défini"
    # Considere genre as other if the max frequency is 1
    # if max_frequency <= 1 :
    #     genre = "other"
# is_float(genre) or 
    # if the genre is a single caracter, we consider it as a non-defined genre
        # if len(genre) == 1 or genre == None or genre == '':

    if is_float(genre) or genre == None or genre == '':
        genre = "Non-défini"

    if first_run_remplacer_genre:
        list_genre_after_preprocessing.add(genre)

    return genre

def standardize_string(df, column_name):
    
    df[column_name] = df[column_name].str.replace('[^\w\s]', '', regex=True)
    df[column_name] = df[column_name].str.replace('\d+', '', regex=True)
    df[column_name] = df[column_name].str.replace(' +', ' ', regex=True)
    # remove '-' character
    df[column_name] = df[column_name].str.replace('-', ' ', regex=True)
    df[column_name] = df[column_name].str.strip()
    df[column_name] = df[column_name].str.lower()
    return df

def remove_empty_string_row(df, column_name):
    df = df[df[column_name] != '']
    df = df[df[column_name] != ' ']
    return df

################################################# INIT DF_SONG
df_song = pd.read_csv('site/public/GraphVisualisation/data/csv/wasabi_songs_250k_standardized.csv')
# df_album = pd.read_csv('site/public/GraphVisualisation/data/csv/wasabi_albums.csv', nrows=250_000)
df_album = pd.read_csv('site/public/GraphVisualisation/data/csv/wasabi_albums.csv')


df_song = df_song.drop_duplicates()
df_album = df_album.drop_duplicates()

df_song = df_song[df_song['albumTitle'].notna()]
df_song = df_song[df_song['artist'].notna()]
df_album = df_album[df_album['title'].notna()]

df_song = standardize_string(df_song, 'artist')
df_song = standardize_string(df_song, 'albumTitle')
df_song = standardize_string(df_song, 'album_genre')
df_album = standardize_string(df_album, 'genre')
df_album = standardize_string(df_album, 'title')

dictionnaire = creer_dictionnaire_frequences('site/public/GraphVisualisation/preprocessing/genre_music_all.txt')
print(dictionnaire)
with open('site/public/GraphVisualisation/data/json/dictionnaire_frequences_genre.json', 'w') as fichier_sortie:
    json.dump(dictionnaire, fichier_sortie)

list_genre_after_preprocessing = set()
df_song['album_genre'] = df_song.apply(remplacer_genre, axis=1)
first_run_remplacer_genre = False
df_album['genre'] = df_album.apply(remplacer_genre, axis=1, column_name='genre')

print("Genre kept", list_genre_after_preprocessing)
list_genre_after_preprocessing = list(list_genre_after_preprocessing)
with open('site/public/GraphVisualisation/data/json/list_genre_after_preprocessing.json', 'w') as outfile:
    json.dump(list_genre_after_preprocessing, outfile)

df_song = remove_empty_string_row(df_song, 'albumTitle')
df_song = remove_empty_string_row(df_song, 'artist')
df_album = remove_empty_string_row(df_album, 'title')

df_song = df_song.fillna('None')
df_album = df_album.fillna('None')

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
        album_details = df_album[df_album['title'] == album_title].to_dict('records')
        if album_details:
            album_details = album_details[0]
            album_details = {key: album_details[key] for key in album_keys_to_extract}
            album_details_cache[album_title] = album_details
        else:
            # Créez un dictionnaire avec des valeurs par défaut "None"
            album_details = {key: 'None' for key in album_keys_to_extract}
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
with open('site/public/GraphVisualisation/data/json/albums_to_number_of_artists.json', 'w') as outfile:
    json.dump(albums_to_number_of_artists, outfile)

# export to json
with open('site/public/GraphVisualisation/data/json/albums_to_artists_to_music_details.json', 'w') as outfile:
    json.dump(albums_to_artists, outfile)

end_time = time.time()
execution_time = end_time - start_time
print(f"Le programme a mis {round(execution_time)} secondes à s'exécuter.")