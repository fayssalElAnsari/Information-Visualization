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
    const lifeSpanBeginMax = 2010;
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
            // Utilisez d3.pointer pour obtenir les coordonnées du curseur de la souris
            const d = d3.select(this).datum();
            const [x, y] = d3.pointer(event, this);

            tooltip.style('display', 'block')
                .html(`Fans: ${d.deezerFans}<br>Année de début: ${d.lifeSpanBegin}`)
                .style('left', (x + 10) + 'px')
                .style('top', (y - 30) + 'px');
        })
        .on('mouseout', function () {
            tooltip.style('display', 'none');
        });

    // *******************filtres***********************
    addFilters(data);
    setupZoomAndModal(data);
}

// Fonction pour ajouter des filtres interactifs
function addFilters(data) {
    const countryFilter = document.getElementById('country-filter');

    countryFilter.addEventListener('change', function () {
        const selectedCountry = countryFilter.value;
        const svg = d3.select('#scatter-plot');

        // Masquez tous les points
        svg.selectAll('circle').style('display', 'none');

        if (selectedCountry === 'all') {
            // Affichez tous les points si "Tous les pays" est sélectionné
            svg.selectAll('circle').style('display', 'block');
        } else {
            // Affichez uniquement les points pour le pays sélectionné
            svg.selectAll('circle')
                .filter(function (d) {
                    return d.paysNaissance === selectedCountry;
                })
                .style('display', 'block');
        }
    });

    const genderFilter = document.getElementById('gender-filter');

    genderFilter.addEventListener('change', function () {
        const selectedGender = genderFilter.value;
        const svg = d3.select('#scatter-plot');

        // Masquez tous les points
        svg.selectAll('circle').style('display', 'none');

        if (selectedGender === 'all') {
            // Affichez tous les points si "Tous les genres" est sélectionné
            svg.selectAll('circle').style('display', 'block');
        } else {
            // Affichez uniquement les points pour le genre sélectionné
            svg.selectAll('circle')
                .filter(function (d) {
                    return d.gender === selectedGender;
                })
                .style('display', 'block');
        }
    });
}

// Fonction pour gérer le zoom et la fenêtre modale
function setupZoomAndModal(data) {
    const svg = d3.select('#scatter-plot');

    svg.selectAll('circle').on('click', function () {
        // Afficher la fenêtre modale
        const artistName = d3.select(this).attr('name');  // Obtenez le nom de l'artiste
        const artistID = d3.select(this).attr('_id');  // Obtenez l'id de l'artiste

        document.getElementById("artistModal").style.display = "block";

        // Chargez ici les détails de l'artiste en fonction du nuage de points cliqué.
        // Remplissez la div #artistDetails avec les informations de l'artiste.
        document.getElementById("artistDetails").innerHTML = `<h3>${artistName}</h3>`;

        // Utilisez D3.js pour lire le fichier CSV des albums associés à l'artiste
        d3.csv("data/albums_cleaned_MO.csv").then(function (albumData) {
            // Vous avez maintenant accès aux données des albums sous forme de tableau d'objets
            // Filtrez les albums associés à l'artiste sélectionné (artistID)
            const selectedArtistAlbums = albumData.filter(function (album) {
                return album.id_artist === artistID;
            });

            // Créez une liste des albums et ajoutez-la à la fenêtre modale
            const albumsList = document.createElement("ul");

            selectedArtistAlbums.forEach(function (album) {
                const albumItem = document.createElement("li");
                albumItem.textContent = `Album: ${album.name}, Fans: ${album.deezerFans}, Genre:${album.genre}, Language: ${album.language}`;
                albumsList.appendChild(albumItem);
            });

            document.getElementById("artistDetails").appendChild(albumsList);
        });
    });

    // Gestionnaire d'événements pour fermer la fenêtre modale lorsque vous cliquez en dehors de la fenêtre modale
    window.addEventListener("click", function (event) {
        if (event.target == document.getElementById("artistModal")) {
            document.getElementById("artistModal").style.display = "none";
        }
    });

    // Gestionnaire d'événements pour fermer la fenêtre modale en cliquant sur la croix
    document.querySelector(".close").addEventListener("click", function () {
        document.getElementById("artistModal").style.display = "none";
    });
}

// Fonction principale pour initialiser l'application
function initializeApp() {
    loadArtistData();
}

// Appel de la fonction principale pour initialiser l'application
initializeApp();
