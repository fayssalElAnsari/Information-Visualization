function toggleCollabLink(checkbox) {
    const linkElements = document.querySelectorAll(".link.collaboration");

    if(checkbox.checked) {

    
        linkElements.forEach(element => {
            element.style.display = "block";
        });
    }
    else {
        linkElements.forEach(element => {
            element.style.display = "none";
        });
    }
}

function toggleParticipateLink(checkbox) {
    const linkElements = document.querySelectorAll(".link.participate");
    if(checkbox.checked) {
        linkElements.forEach(element => {
            element.style.display = "block";
        });
    }
    else {
        linkElements.forEach(element => {
            element.style.display = "none";
        });
    }
}

function buildTooltipContentNode(d) {
    let html = '';
    if (d.type === "artist") {
        console.warn("Details de l'artist : NOT IMPLEMENTED YET", d);
        /**
         * TODO:
         * - Afficher le nom de l'artiste
         * 
         */
    }
    /**
     * LIST KEY OF d.album_details
     * _id
genre
id_artist
length
name (artist name)
publicationDate
rdf
title
urlAlbum
urlAllmusic
urlAmazon
urlDiscogs
urlITunes
urlMusicBrainz
urlSpotify
urlWikipedia
id_album_deezer
urlDeezer
cover
cover.big
cover.medium
cover.small
cover.standard
cover.xl
deezerFans
explicitLyrics
upc
barcode
country
dateRelease
disambiguation
id_album_musicbrainz
language
id_album_discogs
     */


    else if (d.type === "album") {
        html += "<h3>Titre de l'album: " + d.album_details.title + "</h3>";
        html += "<p>Artiste: " + d.album_details.name + "</p>";
        html += "<p>Genre: " + d.album_details.genre + "</p>";
        html += "<p>Date de publication: " + d.album_details.publicationDate + "</p>";


        /**
         * urlAlbum
urlAllmusic
urlAmazon
urlDiscogs
urlITunes
urlMusicBrainz
urlSpotify
urlWikipedia
         */
        if (d.album_details.urlAlbum != 'None') {
            html += '<a href="' + d.album_details.urlAlbum + '" target="_blank">Écouter sur Album</a><br>';
        }
        if (d.album_details.urlAllmusic != 'None') {
            html += '<a href="' + d.album_details.urlAllmusic + '" target="_blank">Écouter sur Allmusic</a><br>';
        }
        if (d.album_details.urlAmazon != 'None') {
            html += '<a href="' + d.album_details.urlAmazon + '" target="_blank">Écouter sur Amazon</a><br>';
        }
        if (d.album_details.urlDiscogs != 'None') {
            html += '<a href="' + d.album_details.urlDiscogs + '" target="_blank">Écouter sur Discogs</a><br>';
        }
        if (d.album_details.urlITunes != 'None') {
            html += '<a href="' + d.album_details.urlITunes + '" target="_blank">Écouter sur ITunes</a><br>';
        }
        if (d.album_details.urlMusicBrainz != 'None') {
            html += '<a href="' + d.album_details.urlMusicBrainz + '" target="_blank">Écouter sur MusicBrainz</a><br>';
        }
        if (d.album_details.urlSpotify != 'None') {
            html += '<a href="' + d.album_details.urlSpotify + '" target="_blank">Écouter sur Spotify</a><br>';
        }
        if (d.album_details.urlWikipedia != 'None') {
            html += '<a href="' + d.album_details.urlWikipedia + '" target="_blank">Écouter sur Wikipedia</a><br>';
        }

        return html;
    }


    else {
        // Error
        console.error("buildTooltipContentNode : Unknown node type", d);
        return null;
    }
}

function buildTooltipContentLink(d) {
    let html = '';
    if (d.type === "collaboration") {
        console.log("Click on collaboration link, d:", d);
        html += "<h3>Collaboration</h3>";
        html += "<h4>Album commun :</h4>";
        // convert set : d.commun_albums to array

        let array_commun_albums = Array.from(d.commun_albums);
        array_commun_albums.forEach(album => {
            html += "<p>" + album + "</p><br>";
        }
        );
        return html;


    }
    else if (d.type === "music") {
        html += "<h3>Titre de la musique: " + d.details.title + "</h3>";
        html += "<p>Nom de l'artiste: " + d.details.artist + "</p>";
        html += "<p>Nom de l'album: " + d.details.albumTitle + "</p>";
        html += "<p>Genre de l'album: " + d.details.album_genre + "</p>";

        // Créer des lecteurs audio pour les URL disponibles
        if (d.details.preview != 'None') {
            html += "<h4>Écouter un extrait :</h4>";
            html += "<audio controls>";
            html += '<source src="' + d.details.preview + '" type="audio/mpeg">';
            html += "Votre navigateur ne supporte pas l'audio HTML5.";
            html += "</audio>";
        } else {
            // pas de preview disponible
            html += "<p>Pas d'extrait disponible</p>";
        }

        html += "<br>"

        // Ajouter d'autres URL pour écouter la musique depuis d'autres services (par exemple, Spotify, Deezer, etc.)
        /**
         * urlAmazon
urlDeezer
urlGoEar
urlHypeMachine
urlItunes
urlLastFm
urlMusicBrainz
urlPandora
urlSong
urlSpotify
urlWikipedia
urlYouTube
urlYouTubeExist
         */

        // ajouter 5 liens max

        if (d.details.urlAmazon != 'None') {
            html += '<a href="' + d.details.urlAmazon + '" target="_blank">Écouter sur Amazon</a><br>';
        }
        if (d.details.urlDeezer != 'None') {
            html += '<a href="' + d.details.urlDeezer + '" target="_blank">Écouter sur Deezer</a><br>';
        }
        if (d.details.urlGoEar != 'None') {
            html += '<a href="' + d.details.urlGoEar + '" target="_blank">Écouter sur GoEar</a><br>';
        }
        if (d.details.urlHypeMachine != 'None') {
            html += '<a href="' + d.details.urlHypeMachine + '" target="_blank">Écouter sur HypeMachine</a><br>';
        }
        if (d.details.urlItunes != 'None') {
            html += '<a href="' + d.details.urlItunes + '" target="_blank">Écouter sur Itunes</a><br>';
        }
        if (d.details.urlLastFm != 'None') {
            html += '<a href="' + d.details.urlLastFm + '" target="_blank">Écouter sur LastFm</a><br>';
        }
        if (d.details.urlMusicBrainz != 'None') {
            html += '<a href="' + d.details.urlMusicBrainz + '" target="_blank">Écouter sur MusicBrainz</a><br>';
        }
        if (d.details.urlPandora != 'None') {
            html += '<a href="' + d.details.urlPandora + '" target="_blank">Écouter sur Pandora</a><br>';
        }
        if (d.details.urlSong != 'None') {
            html += '<a href="' + d.details.urlSong + '" target="_blank">Écouter sur Song</a><br>';
        }
        if (d.details.urlSpotify != 'None') {
            html += '<a href="' + d.details.urlSpotify + '" target="_blank">Écouter sur Spotify</a><br>';
        }
        if (d.details.urlWikipedia != 'None') {
            html += '<a href="' + d.details.urlWikipedia + '" target="_blank">Écouter sur Wikipedia</a><br>';
        }
        if (d.details.urlYouTube != 'None') {
            html += '<a href="' + d.details.urlYouTube + '" target="_blank">Écouter sur YouTube</a><br>';
        }
        if (d.details.urlYouTubeExist != 'None') {
            html += '<a href="' + d.details.urlYouTubeExist + '" target="_blank">Écouter sur YouTubeExist</a><br>';
        }

        return html;
    }

    //Error
    console.error("buildTooltipContentLink : Unknown link type");
    return null;

}

function decodeUniqueId(uniqueId) {
    const parts = uniqueId.split('-');
    if (parts.length === 2) {
        return {
            type: parts[0],
            name: parts[1]
        };
    } else {
        // Gérer une erreur si l'identifiant unique n'est pas au format attendu
        console.error("Format d'identifiant unique invalide : " + uniqueId);
        return null;
    }
}

window.addEventListener("resize", () => {
    d3.select("svg").attr("width", window.innerWidth - 50).attr("height", window.innerHeight - 50);
});

function filterGenre(genre) {
    console.log("filterGenre", genre);

    // HIDE / SHOW NODES

    // "data-source"// album
    // "data-target" // artist
    // data-genre
    // music ->> .participate
    // album ->> .collaboration

    const albumNodes = document.querySelectorAll(".album");
    const artistNodes = document.querySelectorAll(".artist");

    artistNodes.forEach(artistNode => {
        artistNode.style.display = "block";
        artistNode.nextElementSibling.style.display = "block";
    });

    albumNodes.forEach(albumNode => {
        if (genre == "all") {
            // TO fix : cohabitation avec les deux boutons toggle link
            albumNode.style.display = "block";
            const links = document.querySelectorAll(".link");
            links.forEach(link => {
                link.style.display = "block";
            });

            const text = document.querySelectorAll("text");
            text.forEach(text => {
                text.style.display = "block";
            });

        }
        else if (albumNode.dataset.genre == genre) {
            albumNode.style.display = "block";
            albumNode.nextElementSibling.style.display = "block";

            const links = document.querySelectorAll(".link[data-source='" + albumNode.dataset.id + "']");
            links.forEach(link => {
                link.style.display = "block";
            });
        }
        else {
            albumNode.style.display = "none";
            albumNode.nextElementSibling.style.display = "none";
            // Supprimer les liens associés
            const links = document.querySelectorAll(".link[data-source='" + albumNode.dataset.id + "']");
            links.forEach(link => {
                link.style.display = "none";
            });
        }
    });

    artistNodes.forEach(artistNode => {
        // if no link with this artist display none
        const links = document.querySelectorAll(".link[data-target='" + artistNode.dataset.id + "'][style='display: block;']");
        if (links.length == 0) {
            artistNode.style.display = "none";
            artistNode.nextElementSibling.style.display = "none";
        }
        else {
            artistNode.style.display = "block";
            artistNode.nextElementSibling.style.display = "block";
        }
    });


}