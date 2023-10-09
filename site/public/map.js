// Load external data
Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ),
  d3.csv(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv"
  ),
]).then((files) => {
  let topo = files[0],
    data = files[1];
  let colorScale = d3
    .scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);
  // Draw the map
  svg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path") // draw each country
    .attr("d", d3.geoPath().projection(projection))
    // set the color of each country according to the value in the csv data
    .attr("fill", (d) => colorScale(getValue(d.id)));
  function getValue(countryId) {
    let item = data.find((d) => d.code === countryId);
    return item ? item.pop : 0;
  }
});
