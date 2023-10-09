// The svg
const svg = d3.select("#my_dataviz");

// Get the width and height of the SVG after it has been resized by CSS
const width = +svg.node().getBoundingClientRect().width;
const height = +svg.node().getBoundingClientRect().height;

// Map and projection
const projection = d3
  .geoNaturalEarth1()
  .scale(width / 1.3 / Math.PI)
  .translate([width / 2, height / 2]);

// Load external data and boot
d3.json(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
).then(function (data) {
  // Draw the map
  svg
    .append("g")
    .selectAll("path")
    .data(data.features)
    .join("path")
    .attr("fill", "#69b3a2")
    .attr("d", d3.geoPath().projection(projection))
    .style("stroke", "#fff");
});
