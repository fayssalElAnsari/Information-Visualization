// Dimensions
const width = 800;
const height = 400;

// SVG container
const svg = d3.select("#map").attr("width", width).attr("height", height);

// Define a projection
const projection = d3
  .geoMercator()
  .fitSize([width, height], { type: "Sphere" });
const path = d3.geoPath().projection(projection);

// Tooltip
const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Load data
Promise.all([
  d3.json(
    "https://raw.githubusercontent.com/d3/d3.github.io/master/world-110m.v1.json"
  ),
  d3.csv("./data/wasabi_albums_pre-processed.csv"), // Replace with the path to your CSV file
]).then(([world, data]) => {
  const countries = topojson.feature(world, world.objects.countries).features;

  // Aggregate data by country
  const countryData = d3.group(data, (d) => d.country);

  // Color scale
  const color = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(countryData.values(), (d) => d.length)]);

  // Draw map
  svg
    .selectAll("path")
    .data(countries)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) =>
      color(countryData.get(d.properties.iso_a2)?.length || 0)
    )
    .on("mouseover", (event, d) => {
      // Show tooltip on mouseover
      const countryInfo = countryData.get(d.properties.iso_a2) || [];
      tooltip
        .html(
          countryInfo
            .map(
              (doc) =>
                `<p>${doc.title} (${doc.publicationDate}, ${doc.length})</p>`
            )
            .join("")
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px")
        .style("opacity", 1);
    })
    .on("mouseout", () => {
      // Hide tooltip on mouseout
      tooltip.style("opacity", 0);
    });
});
