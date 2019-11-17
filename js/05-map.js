function enterPlot5(map_data, data) {
  // setup
	const bbox = d3.select("#mapPlot").node().getBoundingClientRect();

	const width = bbox.width;
	const height = bbox.height;
	const margin = {top: 100, right: 50, bottom: 50, left: 60};

	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.bottom - margin.top;

	const svg = d3.select("#mapPlot").select("svg");

	const DURATION = 1000;

  // scale, projections, paths
  const colourScale = d3.scaleThreshold()
      .domain([110000, 125000, 140000, 155000, 170000, 185000])
      .range(d3.schemeBlues[7]);

  const projection = d3.geoAlbers()
      .center([-1, 54.8])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(1200 * 12);

  const path = d3.geoPath()
      .projection(projection);

  // create maps to hold LGD counts and names
  var counts = d3.map();
  var names = d3.map();

  data.forEach(d => {
    counts.set(d.area_code, +d.MYE)
    names.set(d.area_code, d.area_name)
  });

  // write area description
  function areaDescription(area_code) {
    let name = names.get(area_code);
    let pop = d3.format(",.4r")(counts.get(area_code));

    return `${name} <br><b>${pop}</b> people`;
  }

  // add in LGDs
  svg.selectAll("path.lgd")
    .data(map_data.features)
      .enter()
    .append("path")
      .attr("opacity", 0)
      .attr("class", "lgd")
      .attr("id", d => d.properties.LGDCODE)
      .attr("d", path)
      .attr("fill", d => colourScale(counts.get(d.properties.LGDCODE)))
      .on("mouseover", function() {
        d3.select(this).classed("lgd-hover", true);
        let area_code = d3.select(this).attr("id");

        d3.select("#lgd-description").html(areaDescription(area_code));
      })
      .on("mouseout", function() {
        d3.select(this).classed("lgd-hover", false)
        d3.select("#lgd-description").html("");
      })
    .transition().duration(1000)
      .attr("opacity", 1);

  // and colour Legend
  var colourLegend = d3.legendColor()
      .labelFormat(d3.format(","))
      .labels(d3.legendHelpers.thresholdLabels)
      .scale(colourScale);

  svg.append("g")
    .attr("class", "colourLegend")
    .attr("transform", "translate(0, 100)")
    .call(colourLegend);

  // titles
  const header = svg.append("g").attr("id", "header");

  header.selectAll(".chartTitle")
    .data([{"label": "Population estimates for Local Government Districts, mid-2018"}])
      .enter()
    .append("text")
      .text(d => d.label)
      .attr("x", 0)
      .attr("y", margin.top - 20)
      .attr("text-anchor", "start")
      .attr("class", "chartTitle");

  const footer = svg.append("g").attr("id", "footer");

  footer.selectAll(".captionText")
	  .data([{"label": "Source: Northern Ireland Statistics and Research Agency"}])
	    .enter()
	  .append("text")
	    .text(d => d.label)
		  .attr("x", 0)
		  .attr("y", height)
		  .attr("dy", "-1em")
		  .attr("text-anchor", "start")
		  .attr("class", "captionText");
}
