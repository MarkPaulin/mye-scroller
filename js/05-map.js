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
	
	const map = topojson.feature(map_data, map_data.objects.simple_lgd);
	
	var plot = svg.append("g")
	    .attr("id", "plot")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

  // scale, projections, paths
  const thresholds = [110000, 125000, 140000, 155000, 170000, 185000]
  
  const colourScale = d3.scaleThreshold()
      .domain(thresholds)
      .range(d3.schemeBlues[7]);

  const projection = d3.geoAlbers()
      .rotate([4.4, 0])
	  .fitSize([plotWidth - margin.left - margin.right, plotHeight], map);

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
  plot.selectAll("path.lgd")
    .data(map.features)
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
    .transition().duration(DURATION)
      .attr("opacity", 1);

  // and colour legend
  // adapted from https://bl.ocks.org/mbostock/4573883
  var formatNumber = d3.format(",.0f");
  
  var legendScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.MYE))
	  .range([0, 500]);
	
  var legendAxis = d3.axisRight(legendScale)
      .tickValues(thresholds.slice(1))
	  .tickSize(10)
	  .tickFormat(formatNumber);
  
  var legend = plot.append("g")
      .attr("class", "legendColour")
	  .attr("transform", `translate(10, 20)`)
	  .call(legendAxis);
  
  legend.select(".domain").remove();
  
  legend.selectAll(".rect")
      .data(colourScale.range().map(function(colour) {
		  var d = colourScale.invertExtent(colour);
		  if (d[0] == null) d[0] = legendScale.domain()[0];
		  if (d[1] == null) d[1] = 200000;
		  return d;
	  }))
	  .enter().insert("rect", ".tick")
	    .attr("width", 8)
		.attr("y", d => legendScale(d[0]))
		.attr("height", d => legendScale(d[1]) - legendScale(d[0]))
		.attr("fill", d => colourScale(d[0]));
  
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
