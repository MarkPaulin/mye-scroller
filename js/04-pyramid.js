function makePlot4(data, response) {
	
	// setup
	const bbox = d3.select("#chart").node().getBoundingClientRect();
	
	const width = bbox.width;
	const height = bbox.height;
	const margin = {top: 100, right: 50, bottom: 50, left: 60};
	
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.bottom - margin.top;
	
	const gutter = 10;
	const plotCenter = plotWidth * 0.5;
	
	const svg = d3.select("#chart").select("svg");
	
	const DURATION = 1000;
		
	// create scales
	
	const xScale = d3.scaleLinear()
		.domain([-1.5*d3.max(data, d => d.MYE), 1.5*d3.max(data, d => d.MYE)]).nice()
		.range([0, plotWidth - margin.left - margin.right]);
		
	const yScale = d3.scaleBand()
		.domain(d3.map(data, d => d.age).keys())
		.range([plotHeight, 0])
		.paddingInner(0.2);
	
	const fillScale = d3.scaleOrdinal(d3.schemeAccent)
		.domain(d3.map(data, d => d.gender).keys());
	
	
	// x axis, label and grid
	svg.select(".xAxis")
		.attr("transform", `translate(${margin.left}, ${plotHeight + margin.top})`)
		.call(d3.axisBottom(xScale)
			.tickFormat(d => d >= 0 ? d3.format(",")(d) : d3.format(",")(-d))
		);
	
	svg.select(".xGrid")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(xScale)
			.tickValues([])
		);
	
	svg.selectAll(".xLabel")
	  .data([{"label": "Persons"}])
	    .text(d => d.label);
	
	// y axis, label and grid
	svg.select(".yAxis")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(yScale)
			.tickValues(d3.range(0, 100, 10))
		);
	
	svg.select(".yGrid")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(yScale)
			.tickFormat("")
			.tickValues(d3.range(0, 100, 10))
			.tickSize(-plotWidth + margin.right + margin.left)
		);
	
	// bars
	const plot = svg.select("#plot");
	
	if (response.direction === "down") {
		
		plot.selectAll(".line").remove();
		
		plot.selectAll(".bar")
		  .data(data.filter(d => d.year === 2018)).enter()
		    .append("rect")
			.attr("class", "bar")
			.attr("y", d => yScale(d.age))
			.attr("height", yScale.bandwidth())
			.attr("x", xScale(0))
			.attr("width", 0)
			.attr("fill", d => fillScale(d.gender))
		  .transition().duration(DURATION)
			.attr("x", d => (d.gender === "Males" ? xScale(-d.MYE) : xScale(0)))
			.attr("width", d => xScale(0) - xScale(-d.MYE));
			
	}
	
	// lines
	const line = d3.line()
		.x(d => d.gender === "Males" ? xScale(-d.MYE) : xScale(d.MYE))
		.y(d => (yScale(d.age) + (0.5 * yScale.bandwidth())));
	
	var lineNest = d3.nest()
		.key(d => d.gender)
		.entries(data.filter(d => d.year === 2008));
	
		
	if (response.direction === "down") {
		
		plot.selectAll(".line")
		  .data(lineNest).enter()
		    .append("path")
			.attr("class", "line")
			.attr("opacity", 0)
			.attr("id", d => d.gender)
			.attr("d", d => line(d.values))
			.attr("stroke", "black")
		  .transition().duration(DURATION)
		    .attr("opacity", 1);
	
	}
	
	
	
	// title, caption
	const header = svg.select("#header");
	
	header.selectAll(".chartTitle")
	  .data([{"label": "Northern Ireland population structure, mid-2008 and mid-2018"}])
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
	
	
	// remove line labels
	
	if (response.direction === "down") {
		
		plot.selectAll(".lineLabel")
		  .transition().duration(DURATION)
		    .attr("opacity", 0)
			.remove();
			
	}
		
}