function makePlot2(data, response) {
	
	// setup
	const bbox = d3.select("#chart").node().getBoundingClientRect();
	
	const width = bbox.width;
	const height = bbox.height;
	const margin = {top: 100, right: 50, bottom: 50, left: 60};
	
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.bottom - margin.top;
	
	const svg = d3.select("#chart").select("svg");
	
	const DURATION = 1000;
		
	// create scales
	
	const xScale = d3.scaleLinear()
		.domain(d3.extent(data, d => d.year))
		.range([0, plotWidth - margin.right - margin.left]);
		
	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, d => d.change)).nice()
		.range([plotHeight, 0]);
	
	
	// x axis, label and grid
	svg.select(".xAxis")
	    .transition().duration(DURATION)
		.attr("transform", `translate(${margin.left}, ${plotHeight + margin.top})`)
		.call(d3.axisBottom(xScale)
			.tickFormat(d3.format("d"))
		);
	
	svg.select(".xGrid")
		.transition().duration(DURATION)
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(xScale)
			.tickValues([])
		);
	
	// y axis, label and grid
	svg.select(".yAxis")
		.transition().duration(DURATION)
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(yScale)
			.tickFormat(d3.format(".1%"))
			.ticks(5)
		);
	
	svg.select(".yGrid")
		.transition().duration(DURATION)
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(yScale)
			.tickFormat("")
			.ticks(5)
			.tickSize(-plotWidth + margin.right + margin.left)
		);
	
	// line
	const plot = svg.select("#plot");
	
	var line = d3.line()
		.x(d => xScale(d.year))
		.y(d => yScale(d.change));
	
	if (response.direction === "down") {
		
		plot.selectAll(".line")
		  .datum(data)
			.transition().duration(DURATION)
			.attr("id", "chart2-line")
			.attr("d", line)
			.attr("stroke-dasharray", null)
			.attr("stroke-dashoffset", null);
			
	} else {
		
		var lines = plot.selectAll(".line")
		  .data([data]);
		
		lines.exit()
			.transition().duration(DURATION)
			.attr("opacity", 0)
			.remove();
		
		lines.transition().duration(DURATION)
			.attr("id", "chart2-line")
			.attr("d", line)
			.attr("stroke", "#313695");
		
	}
	
	// title, caption
	const header = svg.select("#header");
	
	header.selectAll(".chartTitle")
	  .data([{"label": "Annual population change for Northern Ireland, mid-2002 to mid-2018"}])
	    .transition().duration(DURATION)
		.text(d => d.label)
		.attr("x", 0)
		.attr("y", margin.top - 20)
		.attr("text-anchor", "start")
		.attr("class", "chartTitle");
	
	const footer = svg.select("#footer");
	
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
	
	// line labels
	var labelData = data.filter(d => d.year === 2018);
	
	if (response.direction === "down") {
		
		plot.selectAll(".lineLabel")
		  .data(labelData)
		  .transition().duration(DURATION)
			.attr("class", "lineLabel")
			.text(d => d3.format(".1%")(d.change))
			.attr("x", d => xScale(2018.2))
			.attr("y", d => yScale(d.change))
			.attr("dy", "0.4em");
			
	} else {
		
		plot.selectAll(".lineLabel")
		  .transition().duration(DURATION)
		    .attr("opacity", 0);
		
		plot.selectAll(".lineLabel")
		  .data(labelData)
			.join("text")
			.attr("opacity", 0)
			.attr("x", d => xScale(2018.2))
			.attr("y", d => yScale(d.change))
			.attr("dy", "0.4em")
			.attr("fill", "black")
			.text(d => d3.format(".1%")(d.change))
		  .transition().duration(DURATION)
			.attr("opacity", 1);
			
	}
			
		
}