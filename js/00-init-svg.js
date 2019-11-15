function svg_init() {
	
	// Set dimensions	--------------------------------------------------------
	
	const bbox = d3.select("#chart").node().getBoundingClientRect();
	
	const width = bbox.width;
	const height = bbox.height;
	const margin = {top: 100, right: 50, bottom: 50, left: 50};
	
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.bottom - margin.top;
	
	// Append plots		--------------------------------------------------------
	
	
	d3.select("#chart")
	  .append("svg")
	    .attr("width", width)
		.attr("height", height);
	
	d3.select("#mapPlot")
	  .append("svg")
	    .attr("width", width)
		.attr("height", height);
	
	const svg = d3.select("#chart").select("svg");
	
	// Append axes and grid		------------------------------------------------
	
	// x-axis
	svg.append("g")
	    .attr("class", "xAxis");
	
	// y-axis
	svg.append("g")
	    .attr("class", "yAxis");
	
	// gridlines
	svg.append("g")
	    .attr("class", "xGrid");
	
	svg.append("g")
	    .attr("class", "yGrid");
	
	// Append axis labels		------------------------------------------------
	
	svg.selectAll(".xLabel")
	  .data([{"label": ""}])
		.enter()
	  .append("text")
		.attr("class", "xLabel")
		.attr("transform", `translate(0, ${plotHeight + margin.bottom + 10})`)
	  .text(d => d.label)
		.attr("text-anchor", "middle")
		.attr("x", (0.5 * plotWidth))
		.attr("y", margin.top - 25);
	
	// Append plot, header, footer		----------------------------------------
	
	// plot (for lines, bars, ...)
	svg.append("g")
	    .attr("id", "plot");
	
	// header for titles
	svg.append("g")
	    .attr("id", "header");
	
	// footer for source etc
	svg.append("g")
	    .attr("id", "footer");
	
}