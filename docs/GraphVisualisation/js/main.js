d3.json("data/json/list_genre_after_preprocessing.json", function (genreData) {
   
    console.log("Number of genres loaded: " + Object.keys(genreData).length);
    console.log(genreData);

    // build html options for genre select
    const genreSelect = document.getElementById("genre-select");
    const genres = Object.values(genreData); // Obtenez un tableau de tous les genres

    // Triez les genres par ordre alphabétique
    genres.sort((a, b) => a.localeCompare(b));

    // Ajoutez chaque genre trié en tant qu'option
    genres.forEach(genre => {
        const option = document.createElement("option");
        option.text = genre;
        option.value = genre;
        genreSelect.add(option);
    });


    // Charger les données d'albums après avoir chargé les données de genre
    d3.json("data/json/albums_to_artists_to_music_details.json", function (albumData) {
        console.log("Number of albums loaded: " + Object.keys(albumData).length);

        // Créez un SVG
        const width = window.innerWidth - 50;
        const height = window.innerHeight - 50;
        const svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        // Créez un groupe pour contenir les éléments graphiques
        const g = svg.append("g");

        // Ajoutez la fonction de zoom et de déplacement
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on("zoom", () => {
                g.attr("transform", d3.event.transform);
            });


        svg.call(zoom);

        const artists_set = new Set();
        const links = [];
        const nodes = [];

        genre_to_numberOfAlbums = {};

        genre_to_albums = {};

        artist_to_numberOfAlbums = {};

        Object.entries(albumData).forEach(([album, values]) => {
            // Ajoutez un nœud pour l'album
            nodes.push({
                // id: album,
                id: `album-${album}`, // Ajoutez le préfixe "album-" à l'ID de l'album
                type: "album",
                album_details: values["album_details"]
            });

            if (genre_to_albums[values["album_details"]["genre"]] == undefined) {
                genre_to_albums[values["album_details"]["genre"]] = [];
            }

            // Parcourez les contributeurs de cet album
            const albumContributors = Object.keys(values["contributions"]);
            for (let i = 0; i < albumContributors.length; i++) {
                for (let j = i + 1; j < albumContributors.length; j++) {
                    const artist1 = albumContributors[i];
                    const artist2 = albumContributors[j];

                    const id_artist1 = `artist-${artist1}`;
                    const id_artist2 = `artist-${artist2}`;

                    // TODO add commun album to link

                    // Parcours les liens existants pour voir s'il existe déjà un lien entre ces deux artistes
                    let linkExists = false;
                    for (let index = 0; index < links.length; index++) {
                        if (links[index].source == id_artist1 && links[index].target == id_artist2) {
                            links[index].commun_albums.add(album);

                            linkExists = true;
                            break;
                        }
                    }
                    if (!linkExists) {
                        links.push({
                            type: "collaboration",
                            source: id_artist1,
                            target: id_artist2,
                            commun_albums: new Set([album])
                        });
                    }


                }
            }

            if (genre_to_numberOfAlbums[values["album_details"]["genre"]] == undefined) {
                genre_to_numberOfAlbums[values["album_details"]["genre"]] = 0;
            }
            genre_to_numberOfAlbums[values["album_details"]["genre"]] += 1;

            Object.keys(values["contributions"]).forEach(artist => {
                // add artist node
                artists_set.add(artist);
                // add music link
                values["contributions"][artist].forEach(music => {
                    links.push({
                        type: "music",
                        source: `album-${album}`, // Ajoutez le préfixe "album-" à l'ID de l'album
                        target: `artist-${artist}`, // Ajoutez le préfixe "artist-" à l'ID de l'artiste	
                        details: music
                    });
                });

                // Mettez à jour le compteur d'albums pour cet artiste
                if (artist_to_numberOfAlbums[`artist-${artist}`] == undefined) {
                    artist_to_numberOfAlbums[`artist-${artist}`] = 1;
                } else {
                    artist_to_numberOfAlbums[`artist-${artist}`] += 1;
                }
            });
        });

        console.log("genre_to_numberOfAlbums: ", genre_to_numberOfAlbums)
        console.log("Number of artists: " + artists_set.size);

        nodes.push(...Array.from(artists_set).map(artist => ({
            id: `artist-${artist}`, // Ajoutez le préfixe "artist-" à l'ID de l'artiste
            type: "artist"
        })));

        console.log("Nodes builded: " + nodes.length);
        console.log("Links builded: " + links.length);

        const link = g.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .classed("link", true) // Ajoutez la classe "link"
            // ajouter l'attribut source et target
            .attr("data-source", d => d.source) // album
            .attr("data-target", d => d.target); // artist

        link.filter(d => d.type === "music")
            .attr("stroke-width", 5)
            .attr("stroke", "black")
            .classed("participate", true) // Ajoutez la classe "participate"
            ;

        link.filter(d => d.type === "collaboration")
            .classed("collaboration", true) // Ajoutez la classe "collaboration"
            // pointillé
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 2)
            .attr("stroke", "grey");

        // Créez les nœuds pour les artistes et les albums
        const node = g.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .classed("node", true); // Ajoutez la classe "node"

        // Représentez les artistes par des cercles
        node.filter(d => d.type === "artist")
            .append("circle")
            .attr("r", 15)
            .classed("artist", true) // Ajoutez la classe "artist"
            .attr("data-id", d => d.id) // Ajoutez l'attribut id
            .attr("fill", "red");

        // Charger les données de genre
        const genreColorScale = d3.scaleOrdinal()
            .domain(Object.keys(genreData)) // Domaine : genres
            .range(d3.schemeCategory10); // Plage : couleurs

        // Représentez les albums par des carrés et associez la couleur du genre
        node.filter(d => d.type === "album")
            .append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", d => genreColorScale(d.album_details.genre))
            .classed("album", true)
            .attr("data-genre", d => d.album_details.genre) // Ajoutez l'attribut genre
            .attr("data-id", d => d.id) // Ajoutez l'attribut id

            ;

        function removePrefix(str) {
            return str.split("-")[1];
        }

        // Ajoutez des libellés aux nœuds
        node.append("text")
            .text(d => removePrefix(d.id))
            .attr("x", 6)
            .attr("y", 3);

        // Trier les légendes par ordre alphabétique
        const sortedGenreData = genreData.slice().sort((a, b) => a.localeCompare(b));

        // Créez une légende de couleur pour les genres
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(20,20)");

        const legendRectSize = 18;
        const legendSpacing = 4;

        // Ajoutez un rectangle gris en arrière-plan de la légende
        legend.append("rect")
            .attr("width", 150) // Ajustez la largeur selon vos besoins
            .attr("height", sortedGenreData.length * (legendRectSize + legendSpacing))
            .style("fill", "lightgrey");

        const genreLegend = legend.selectAll(".genre-legend")
            .data(sortedGenreData)
            .enter()
            .append("g")
            .attr("class", "genre-legend")
            .attr("transform", (d, i) => `translate(0,${i * (legendRectSize + legendSpacing)})`);

        genreLegend.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .style("fill", d => genreColorScale(d)); // Utilisez la fonction de mise en correspondance des couleurs

        genreLegend.append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", legendRectSize - legendSpacing)
            .text(d => d);


        const defaultLinkDistance = 100;
        const defaultChargeStrength = -50;

        const simulation = d3.forceSimulation(nodes)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("link", d3.forceLink(links)
                .id(d => d.id)
                .distance(link => {
                    // Définis la longueur des liens en fonction du nombre de participations à un album
                    if (link.type === "music") {
                        return customLogarithm(artist_to_numberOfAlbums[link.target.id] + 1, 2) * defaultLinkDistance;
                    }
                    return defaultLinkDistance;
                }))
            .force("charge", d3.forceManyBody().strength(d => {
                // La charge est plus forte pour les albums que pour les artistes
                if (d.type === "album") {
                    return defaultChargeStrength * 2;
                }
                return defaultChargeStrength * 1 / 2;

            }))

        // Mettez à jour la position des nœuds et des liens à chaque tick de la simulation
        simulation.on("tick", () => {
            link.attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node.attr("transform", d => `translate(${d.x},${d.y})`);
        });


        // Sélectionnez le conteneur de tooltip
        const tooltip = d3.select(".tooltip");

        // Gestionnaire d'événement pour les liens (links)
        link.on("click", d => {
            // Empêchez la propagation de l'événement pour éviter la disparition de la tooltip
            d3.event.stopPropagation();

            // Vous pouvez personnaliser le contenu de la tooltip ici en fonction des données (d)
            const tooltipContent = buildTooltipContentLink(d);

            // // Positionnez la tooltip près du nœud
            // const nodeX = d.x; // Coordonnée X du nœud
            // const nodeY = d.y; // Coordonnée Y du nœud

            // next to the middle of the link
            const linkX = (d.source.x + d.target.x) / 2;
            const linkY = (d.source.y + d.target.y) / 2;

            tooltip
                .html(tooltipContent)
                .style("display", "block")
            // .style("left", `${linkX + 20}px`) // Ajustez la position X comme vous le souhaitez
            // .style("top", `${linkY - 20}px`); // Ajustez la position Y comme vous le souhaitez
        });

        // Gestionnaire d'événement pour les nœuds (nodes)
        node.on("click", d => {
            // Empêchez la propagation de l'événement pour éviter la disparition de la tooltip
            d3.event.stopPropagation();

            // Personnalisez le contenu de la tooltip en fonction des données du nœud (d)
            const tooltipContent = buildTooltipContentNode(d);

            // Positionnez la tooltip près du nœud
            const nodeX = d.x; // Coordonnée X du nœud
            const nodeY = d.y; // Coordonnée Y du nœud

            tooltip
                .html(tooltipContent)
                .style("display", "block")
            // .style("left", `${nodeX + 20}px`) // Ajustez la position X comme vous le souhaitez
            // .style("top", `${nodeY - 20}px`); // Ajustez la position Y comme vous le souhaitez
        });

        // Gestionnaire d'événement pour masquer la tooltip lorsque vous cliquez en dehors des éléments
        d3.select("body").on("click", () => {
            tooltip.style("display", "none");
        });



    });
});


// Fonction pour calculer un logarithme personnalisé en utilisant une base donnée
function customLogarithm(value, base) {
    return Math.log(value) / Math.log(base);
}