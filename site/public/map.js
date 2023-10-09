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

// Load external data
// Promise.all([
//   d3.json(
//     "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
//   ),
//   d3.csv(
//     "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"
//   ),
// ]).then((files) => {
//   let topo = files[0],
//     data = files[1];
//   let colorScale = d3
//     .scaleThreshold()
//     .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
//     .range(d3.schemeBlues[7]);
//   // Draw the map
//   svg
//     .append("g")
//     .selectAll("path")
//     .data(topo.features)
//     .enter()
//     .append("path") // draw each country
//     .attr("d", d3.geoPath().projection(projection))
//     // set the color of each country according to the value in the csv data
//     .attr("fill", (d) => colorScale(getValue(d.id)));
//   function getValue(countryId) {
//     let item = data.find((d) => d.code === countryId);
//     return item ? item.pop : 0;
//   }
// });
