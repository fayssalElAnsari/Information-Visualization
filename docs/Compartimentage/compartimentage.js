var svg = d3.select("#visualization");
var node; // Définir node en dehors de d3.json
var data; // Stocker les données JSON globalement
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);


function updateSize() {
  var width = window.innerWidth - 30;
  var height = window.innerHeight - 30;

  svg.attr("width", width);
  svg.attr("height", height);
}

updateSize();
window.addEventListener("resize", updateSize);

var diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(2,2)"),
    format = d3.format(",d");

var pack = d3.pack()
    .size([diameter - 4, diameter - 4]);

var zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

svg.call(zoom);

function zoomed() {
g.attr("transform", d3.event.transform);
}

    d3.json("hierarchical_data.json", function(error, jsonData) {
      if (error) throw error;

    data = jsonData;

    var root = d3.hierarchy(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });

    node = g.selectAll(".node")
      .data(pack(root).descendants())
      .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) {
          var titleText = d.data.name + "\nNombre d'enfants qui ont ces parents : " + format(d.value);

    var parents = [];
    var current = d;
    while (current.parent) {
        current = current.parent;
        parents.push(current.data.name);
    }

    if (parents.length == 1 || parents.length == 2){titleText = "Genre : " + titleText;}
    if (parents.length == 3){titleText = "Artiste : " + titleText;}
    if (parents.length == 4){titleText = "Album : " + titleText;}
    if (d.children === undefined) {titleText = "Chanson : " + titleText;}
    if (parents[parents.length - 1] === "root") {parents.pop();}
    
    parents.reverse();
    if (parents.length > 0) {
        titleText += "\nParents : " + parents.join(" > ");
    }
    return titleText;
    });

  node.append("circle")
      .attr("r", function(d) { return d.r; });

  node.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", "0.3em")
      .text(function(d) { return d.data.name.substring(0, d.r / 3); });

  d3.select("#reset-zoom").on("click", function() {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  });

  // Récupération des noms des éléments à partir des données JSON
  var filterOptions = getFilterOptions(data);

  // Remplissage du menu déroulant avec les options de filtrage
  var filterDropdown = d3.select("#filter-options");
  filterDropdown.selectAll("option")
    .data(filterOptions)
    .enter().append("option")
    .text(function(d) { return d; });

  // Gestionnaire d'événements pour le menu déroulant de filtrage
  d3.select("#filter-options").on("change", function() {
    var selectedOption = this.value;
    // Filtrer les données en fonction de l'option sélectionnée
    var filteredData = filterDataByName(data, selectedOption);
    updateVisualization(filteredData);
  });

  function filterDataByName(node, name) {
    // Fonction de filtrage pour récupérer l'élément par nom et ses enfants
    if (node.name === name) {
      return node;
    }

    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        var filteredChild = filterDataByName(node.children[i], name);
        if (filteredChild) {
          return filteredChild;
        }
      }
    }

    return null;
  }

  d3.select("#reset-data").on("click", function() {
      // Réinitialisation de l'affichage à la totalité des données
      updateVisualization(data);
      // Réinitialisation du menu déroulant
      d3.select("#filter-options").property("value", "");
    });



    // a retravailler
    function updateVisualization(filteredData) {
            // Désactiver le gestionnaire de zoom temporairement
            svg.on(".zoom", null);

            // Mettre à jour la visualisation avec les données filtrées
            g.selectAll("*").remove(); // Effacer la visualisation existante
            var filteredRoot = d3.hierarchy(filteredData)
              .sum(function(d) { return d.value; })
              .sort(function(a, b) { return b.value - a.value; });
            var filteredNode = g.selectAll(".node")
              .data(pack(filteredRoot).descendants())
              .enter().append("g")
              .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
              .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

            filteredNode.append("title")
              .text(function(d) {
                var titleText = d.data.name + "\nNombre d'enfants qui ont ces parents : " + format(d.value);

            var parents = [];
            var current = d;
            while (current.parent) {
                current = current.parent;
                parents.push(current.data.name);
              }
            if (parents[parents.length - 1] === "root") {
                parents.pop();
                if (parents.length == 0 || parents.length == 1){titleText = "Genre : " + titleText;}
                if (parents.length == 2){titleText = "Artiste : " + titleText;}
                if (parents.length == 3){titleText = "Album : " + titleText;}
                if (d.children === undefined) {titleText = "Chanson : " + titleText;}
            } else {
                if (parents.length == 1){titleText = "Genre : " + titleText;}
                if (parents.length == 2){titleText = "Artiste : " + titleText;}
                if (parents.length == 3){titleText = "Album : " + titleText;}
                if (d.children === undefined) {titleText = "Chanson : " + titleText;}
              }
            parents.reverse();
            if (parents.length > 0) {titleText += "\nParents : " + parents.join(" > ");}
            return titleText;
            });

filteredNode.append("circle")
.attr("r", function(d) { return d.r; });

// Réactiver le gestionnaire de zoom
svg.call(zoom);
}

  function getFilterOptions(node) {
    var options = [];
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        options.push(node.children[i].name);
      }
    }
    return options;
  }
});