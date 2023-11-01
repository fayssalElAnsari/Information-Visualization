// Fonction pour charger les données des artistes
function loadArtistData() {
    d3.csv('data/artists_cleaned_MO.csv').then(function (data) {
        // Convertir les données en nombres si nécessaire
        data.forEach(function (d) {
            d.lifeSpanBegin = +d.lifeSpanBegin;
            d.deezerFans = +d.deezerFans;
        });

        // Appeler d'autres fonctions pour créer le graphique, ajouter des filtres, etc.
        createScatterPlot(data);
        addFilters(data);
    });
}

// Fonction pour créer le graphique de nuage de points
function createScatterPlot(data) {
    // Plage des données
    const lifeSpanBeginMin = 1895;
    const lifeSpanBeginMax = 2000;
    const fansMin = 1;
    const fansMax = 1000000;

    // Définir les marges et la taille du graphique
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 900 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;

    // Décalage horizontal souhaité
    const xOffset = 50;

    // Créer un conteneur SVG
    const svg = d3.select('#scatter-plot')
        .attr('width', width + margin.left + margin.right + xOffset) // Ajoutez xOffset à la largeur
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left + xOffset},${margin.top})`); // Ajoutez xOffset à la translation

    // Créer l'échelle pour l'axe X (année de début)
    const xScale = d3.scaleLinear()
        .domain([lifeSpanBeginMin, lifeSpanBeginMax])
        .range([0, width]);

    // Créer l'échelle pour l'axe Y (nombre de fans)
    const yScale = d3.scaleLog()
        .domain([fansMin, fansMax])
        .range([height, 0]);

    // Créez un groupe pour les points
    const circlesGroup = svg.append('g');

    // Ajoutez les points au groupe
    circlesGroup.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.lifeSpanBegin))
        .attr('cy', d => yScale(d.deezerFans))
        .attr('r', 3)
        .attr('name', function (d) {
            return d.name;  // Ajoutez le nom de l'artiste comme attribut
        })
        .attr('_id', function (d) {
            return d._id;  // Ajoutez l'id de l'artiste comme attribut
        })
        .style('fill', 'blue'); // Couleur des points

    // Ajoutez des axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .call(d3.axisLeft(yScale));

    // Ajouter une étiquette à l'axe Y
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle') // Centrez le texte
        .text("Nombre de Fans d'un artiste"); // Texte de l'étiquette

    // Ajouter une étiquette à l'axe X
    svg.append('text')
        .attr('transform', `translate(${width / 2},${height + 35})`) // Ajustez la position de l'étiquette
        .style('text-anchor', 'middle') // Centrez le texte
        .text("Année de début d'une carrière d'un artiste"); // Texte de l'étiquette

    // Créez les info-bulles
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background-color', '#fff')
        .style('border', '1px solid #ccc')
        .style('padding', '10px')
        .style('display', 'none');

    svg.selectAll('circle')
        .on('mouseover', function () {
            d3.select(this)
                .classed('cursor-pointer', true);
                
            // Utilisez d3.pointer pour obtenir les coordonnées du curseur de la souris
            const d = d3.select(this).datum();
            const [x, y] = d3.pointer(event, this);

            tooltip.style('display', 'block')
                .html(`Fans: ${d.deezerFans}<br>Année de début: ${d.lifeSpanBegin}`)
                .style('left', (x + 10) + 'px')
                .style('top', (y - 30) + 'px');
        })
        .on('mouseout', function () {
            d3.select(this)
                .classed('cursor-pointer', false);

            tooltip.style('display', 'none');
        });

    // *******************filtres***********************
    addFilters();
    setupZoomAndModal(data);
}

function addFilters() {
    const countryFilter = document.getElementById('country-filter');
    const genderFilter = document.getElementById('gender-filter');
    // Ajoutez un gestionnaire d'événements pour les deux filtres
    countryFilter.addEventListener('change', applyFilters);
    genderFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const countryFilter = document.getElementById('country-filter');
    const genderFilter = document.getElementById('gender-filter');
    const svg = d3.select('#scatter-plot');
    const selectedCountry = countryFilter.value;
    const selectedGender = genderFilter.value;

    // Masquez tous les points
    svg.selectAll('circle').style('display', 'none');

    // Affichez uniquement les points qui correspondent aux deux filtres
    svg.selectAll('circle')
        .filter(function (d) {
            return (selectedCountry === 'all' || selectedCountry === d.paysNaissance) &&
                (selectedGender === 'all' || selectedGender === d.gender);
        })
        .style('display', 'block');
}

// Fonction pour gérer le zoom et la fenêtre modale
function setupZoomAndModal(data) {
    const svg = d3.select('#scatter-plot');

    svg.selectAll('circle').on('click', function () {
        // Afficher la fenêtre modale
        const artistName = d3.select(this).attr('name');  // Obtenez le nom de l'artiste
        const artistID = d3.select(this).attr('_id');  // Obtenez l'id de l'artiste

        //document.getElementById("artistModal").classList.add("centered-modal");
        document.getElementById("artistModal").style.display = "block";

        // Chargez ici les détails de l'artiste en fonction du nuage de points cliqué.
        // Remplissez la div #artistDetails avec les informations de l'artiste.
        document.getElementById("artistDetails").innerHTML = `<h3> NOM: ${artistName}</h3>`;

        // Utilisez D3.js pour lire le fichier CSV des albums associés à l'artiste
        d3.csv("data/albums_cleaned_MO.csv").then(function (albumData) {
            // Vous avez maintenant accès aux données des albums sous forme de tableau d'objets
            // Filtrez les albums associés à l'artiste sélectionné (artistID)
            const selectedArtistAlbums = albumData.filter(function (album) {
                return album.id_artist === artistID;
            });

            createLineChart(selectedArtistAlbums);
            // const artistChoiceSelect = document.createElement("select");
            // Créez un élément de saut de ligne <br>
            const lineBreak = document.createElement("br");
            document.getElementById("artistDetails").appendChild(lineBreak);

            // GENRE
            const genres = Array.from(new Set(selectedArtistAlbums.map(album => album.genre))); // Liste des genres uniques
            filtreDetailGenreArtist(genres);

            // Langue   
            const langues = Array.from(new Set(selectedArtistAlbums.map(album => album.language)));  // Liste des langues uniques
            filtreDetailLangueArtist(langues);

            // DeezerFans
            const DeezerFans = Array.from(new Set(selectedArtistAlbums.map(album => album.deezerFans)));
            if (DeezerFans.length > 1) {
                TriDécroissantFans(selectedArtistAlbums);
            }
            creerTableau(selectedArtistAlbums);

            // Ajoutez un gestionnaire d'événements de changement pour le filtre de genre
            document.getElementById('genre-filter').addEventListener('change', filterAndSortTaable);

            // Ajoutez un gestionnaire d'événements de changement pour le filtre de langue
            document.getElementById('langue-filter').addEventListener('change', filterAndSortTaable);

            // Ajoutez un gestionnaire d'événements de changement pour le tri par DeezerFans
            document.getElementById('sort-albums').addEventListener('change', filterAndSortTaable);
        });
    });
    // Pour femrer le MODAL 
    document.querySelector(".close").addEventListener("click", function () {
        document.getElementById("artistModal").style.display = "none";
    });
}

function filtreDetailArtist(artistChoiceSelect, genres, texteExplicatif, indexTab) {
    const label = document.createElement("label");
    label.appendChild(document.createTextNode(texteExplicatif));
    label.classList.add("center-label"); // Ajoutez la classe "center-label"
    document.getElementById("artistDetails").appendChild(label);

    genres.unshift("all");
    //artistChoiceSelect.id = "artist-choice"; // Attribuez un ID au select si nécessaire

    // Ajoutez chaque nom d'artiste en tant qu'option au select
    genres.forEach(function (genreAlbum) {
        const option = document.createElement("option");
        option.value = genreAlbum;
        option.textContent = genreAlbum;
        option.classList.add("center-option"); // Ajoutez la classe "center-option"
        artistChoiceSelect.appendChild(option);
    });

    // Ajoutez le select à la fenêtre contextuelle
    document.getElementById("artistDetails").appendChild(artistChoiceSelect);

    artistChoiceSelect.addEventListener('change', function () {
        const selectedGenre = artistChoiceSelect.value; // Obtenez la valeur de l'option sélectionnée

        // Obtenez toutes les lignes (éléments <tr>) du tableau
        const rows = document.querySelectorAll(".album-table tbody tr");

        // Parcourez chaque ligne et affichez ou masquez-la en fonction du genre sélectionné
        rows.forEach(function (row) {
            const genreCell = row.querySelector(indexTab); // Vous pouvez adapter l'index en fonction de la structure de votre tableau

            if (selectedGenre === "all" || genreCell.textContent === selectedGenre) {
                row.style.display = 'table-row'; // Afficher la ligne
            } else {
                row.style.display = 'none'; // Masquer la ligne
            }
        });

    });

}

// filtrer d3.js
function filtreDetailGenreArtist(genres) {
    const genreFilterContainer = d3.select("#artistDetails").append("div")
        .attr("class", "genre-filter-container");

    // Ajoutez le label et le sélecteur "genre" au conteneur
    genreFilterContainer.append("label")
        .attr("for", "genre-filter")
        .text("Filtrer par genre : ");

    // Créez le sélecteur "genre" à l'intérieur du conteneur
    const genreFilter = genreFilterContainer.append("select")
        .attr("id", "genre-filter");

    // Ajoutez l'option par défaut au sélecteur "genre"
    genreFilter.append("option")
        .attr("value", "all")
        .text("Tous les genres");

    // Générez dynamiquement les options du sélecteur de filtrage à partir des valeurs de genre
    //console.log("genres : " , genres);
    genreFilter.selectAll("option")
        .data(["Tous les genres"].concat(genres))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Ajoutez le conteneur du filtre "genre" à "#artistDetails"
    d3.select("#artistDetails").node().appendChild(genreFilterContainer.node());
    genreFilter.on("change", function () {
        //const selectedGenre = d3.select(this).property("value");
        const selectedGenre = genreFilter.node().value;

        // Sélectionnez toutes les lignes du tableau sauf l'en-tête
        const rows = d3.selectAll("#tableId tbody tr");

        // Affichez ou masquez les lignes en fonction du genre sélectionné
        rows.style("display", function () {
            const genreCell = d3.select(this).select("td:nth-child(4)").text(); // Colonne Genre (4ème)
            if (selectedGenre === "all" || genreCell === selectedGenre) {
                return "table-row";
            } else {
                return "none";
            }
        });
    });
}

function filtreDetailLangueArtist(langues) {
    const langueFilterContainer = d3.select("#artistDetails").append("div")
        .attr("class", "langue-filter-container");

    // Ajoutez le label et le sélecteur de langue au conteneur
    langueFilterContainer.append("label")
        .attr("for", "langue-filter")
        .text("Filtrer par langue : ");

    // Créez le sélecteur de langue à l'intérieur du conteneur
    const langueFilter = langueFilterContainer.append("select")
        .attr("id", "langue-filter");

    // Ajoutez l'option par défaut au sélecteur de langue
    langueFilter.append("option")
        .attr("value", "all")
        .text("Toutes les langues");

    // Générez dynamiquement les options du sélecteur de langue à partir des valeurs de langue
    langueFilter.selectAll("option")
        .data(["Toutes les langues"].concat(langues))
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Ajoutez le conteneur du filtre de langue à "#artistDetails"
    d3.select("#artistDetails").node().appendChild(langueFilterContainer.node());

    langueFilter.on("change", function () {
        const selectedLangue = langueFilter.node().value;

        // Sélectionnez toutes les lignes du tableau sauf l'en-tête
        const rows = d3.selectAll("#tableId tbody tr");

        // Affichez ou masquez les lignes en fonction de la langue sélectionnée
        rows.style("display", function () {
            const langueCell = d3.select(this).select("td:nth-child(5)").text(); // Colonne Langue (5ème)
            if (selectedLangue === "all" || langueCell === selectedLangue) {
                return "table-row";
            } else {
                return "none";
            }
        });
    });
}

function filterAndSortTaable() {
    const selectedGenre = document.getElementById('genre-filter').value;
    const selectedLanguage = document.getElementById('langue-filter').value;
    const isSortChecked = document.getElementById('sort-albums').checked;

    // Obtenez toutes les lignes (éléments <tr>) du tableau
    const rows = document.querySelectorAll(".album-table tbody tr");

    // Parcourez chaque ligne et affichez ou masquez-la en fonction des sélections
    rows.forEach(function (row) {
        const genreCell = row.querySelector("td:nth-child(4)").textContent; // Colonne Genre (4ème)
        const languageCell = row.querySelector("td:nth-child(5)").textContent; // Colonne Langue (5ème)

        if ((selectedGenre === "all" || genreCell === selectedGenre) &&
            (selectedLanguage === "all" || languageCell === selectedLanguage)) {
            row.style.display = 'table-row'; // Afficher la ligne
        } else {
            row.style.display = 'none'; // Masquer la ligne
        }
    });

    // Triez les albums par DeezerFans si la case à cocher est cochée
    if (isSortChecked) {
        selectedArtistAlbums.sort((a, b) => b.deezerFans - a.deezerFans);
    } else {
        selectedArtistAlbums.sort((a, b) => a.publicationDate.localeCompare(b.publicationDate));
    }

    // Mettez à jour le tableau avec le nouvel ordre des albums en utilisant D3.js
    const tbody = d3.select(".album-table tbody");

    // Sélectionnez les lignes du tableau existantes
    let rowsD3 = tbody.selectAll("tr").data(selectedArtistAlbums, d => d.id);

    // Supprimez les lignes existantes
    rowsD3.exit().remove();

    // Ajoutez de nouvelles lignes avec les données triées
    const newRows = rowsD3.enter()
        .append("tr")
        .html(function (album) {
            return `
                <td>${album.publicationDate}</td>
                <td>${album.name}</td>
                <td>${album.deezerFans}</td>
                <td>${album.genre}</td>
                <td>${album.language}</td>
                <td><a href="${album.urlAlbum}" target="_blank">Lien</a></td>
            `;
        });

    // Mettez à jour les lignes existantes
    rowsD3 = newRows.merge(rowsD3);
}

function TriDécroissantFans(selectedArtistAlbums) {
    // Ajoutez un élément de type "checkbox" pour le tri
    const sortCheckbox = document.createElement("input");
    sortCheckbox.type = "checkbox";
    sortCheckbox.id = "sort-albums";

    // Créez un label pour la case à cocher
    const sortLabel = document.createElement("label");
    sortLabel.appendChild(sortCheckbox);
    sortLabel.appendChild(document.createTextNode("Tri décroissant (DeezerFans)"));

    document.getElementById("artistDetails").appendChild(sortLabel);

    sortCheckbox.addEventListener('change', function () {
        if (sortCheckbox.checked) {
            // Triez les albums par deezerFans en ordre croissant
            selectedArtistAlbums.sort((a, b) => b.deezerFans - a.deezerFans);
        } else {
            // Rétablissez l'ordre original
            selectedArtistAlbums.sort((a, b) => a.publicationDate.localeCompare(b.publicationDate));
        }

        // Mettez à jour le tableau avec le nouvel ordre des albums
        const tbody = document.querySelector(".album-table tbody");
        tbody.innerHTML = ""; // Effacez le contenu actuel du tableau

        selectedArtistAlbums.forEach(function (album) {
            const albumRow = tbody.insertRow();
            albumRow.innerHTML = ` <td>${album.publicationDate}</td>
                                     <td>${album.name}</td>
                                     <td>${album.deezerFans}</td>
                                     <td>${album.genre}</td>
                                     <td>${album.language}</td>
                                     <td><a href="${album.urlAlbum}" target="_blank">Lien</a></td> `;
        });
    });
}

function creerTableau(selectedArtistAlbums) {
    // Créez un tableau
    const table = d3.select("#artistDetails").append("table")
        .classed("album-table", true) // Ajoutez une classe CSS pour le style
        .attr("id", "tableId");

    // Créez l'en-tête du tableau
    const thead = table.append("thead");
    const headerRow = thead.append("tr");
    headerRow.html(`
                    <th>Date de publication</th>
                    <th>Titre</th>
                    <th>Deezer fans</th>
                    <th>Genre</th>
                    <th>Langue</th>
                    <th>URL</th>
                    `);

    // Créez le corps du tableau
    const tbody = table.append("tbody");

    // Remplissez le tableau avec les données des albums
    selectedArtistAlbums.forEach(function (album) {
        const albumRow = tbody.append("tr");
        albumRow.html(`
                        <td>${album.publicationDate}</td>
                        <td>${album.title}</td>
                        <td>${album.deezerFans}</td>
                        <td>${album.genre}</td>
                        <td>${album.language}</td>
                        <td><a href="${album.urlAlbum}" target="_blank">Lien</a></td>
                    `);
    });

}

// Fonction pour créer le graphique linéaire avec D3.js
function createLineChart(albumsData) {
    // Extraire les données nécessaires (publicationDate et deezerFans) de chaque album
    const data = albumsData.map(function (album) {
        return {
            publicationDate: album.publicationDate, // Utilisez l'année telle quelle
            deezerFans: +album.deezerFans, // Convertissez le nombre de fans en nombre
        };
    });
    // Définir les marges, la largeur et la hauteur du graphique
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Décalage horizontal souhaité
    const xOffset = 50;
    // Créer un conteneur SVG pour le graphique linéaire
    const svg = d3.select("#artistDetails").append("svg")
        .attr("width", width + margin.left + margin.right + xOffset) // Ajoutez xOffset à la largeur
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left + xOffset}, ${margin.top})`);// Ajoutez xOffset à la translation

    // Créer les échelles x et y
    const xScale = d3.scaleTime()
        //.domain(d3.extent(data, d => d.publicationDate))1895
        .domain([d3.min(data, d => d.publicationDate), d3.max(data, d => d.publicationDate)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.deezerFans)])
        .range([height, 0]);

    // Créer une ligne pour représenter l'évolution du nombre de fans
    const line = d3.line()
        .x(d => xScale(d.publicationDate))
        .y(d => yScale(d.deezerFans));

    // Ajouter l'axe x
    // Créez un formateur d'axe pour afficher les années correctement
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    // Ajoutez l'axe X à votre graphique
    svg.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    // Ajouter une étiquette à l'axe X
    svg.append('text')
        .attr('transform', `translate(${width / 2},${height + 35})`) // Ajustez la position de l'étiquette
        .style('text-anchor', 'middle') // Centrez le texte
        .text("Année de publication d'un album "); // Texte de l'étiquette

    // Ajouter l'axe y
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Ajouter une étiquette à l'axe Y
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left)
        .attr('x', -height / 2)
        .style('text-anchor', 'middle') // Centrez le texte
        .text("Nombre de Fans d'un album"); // Texte de l'étiquette

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.publicationDate); })
        .attr("cy", function (d) { return yScale(d.deezerFans); })
        .attr("r", 5) // rayon du cercle
        .style("fill", "red"); // couleur des points

    // Dessiner la ligne du graphique
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    // Ajoutez des axes, des étiquettes, etc., pour améliorer le graphique
}

// Fonction principale pour initialiser l'application
function initializeApp() {
    loadArtistData();
}

// Appel de la fonction principale pour initialiser l'application
initializeApp();

