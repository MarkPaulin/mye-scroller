function makePlot1(data, response) {
	
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
		.domain(d3.extent(data, d => d.MYE)).nice()
		.range([plotHeight, 0]);
	
	
	// x axis, label and grid?
	svg.select(".xAxis")
		.attr("transform", `translate(${margin.left}, ${plotHeight + margin.top})`)
		.call(d3.axisBottom(xScale)
			.tickFormat(d3.format("d"))
		);
	
	svg.select(".xGrid")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(xScale)
			.tickValues([])
		);
	
	svg.selectAll(".xLabel")
	  .data([{"label": "Year"}])
	    .transition().duration(DURATION)
	  .text(d => d.label);
	 
	
	// y axis, label and grid
	svg.select(".yAxis")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(yScale)
			.tickFormat(d3.format(","))
			.ticks(5)
		);
	
	svg.select(".yGrid")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.call(d3.axisLeft(yScale)
			.tickFormat("")
			.ticks(5)
			.tickSize(-plotWidth + margin.right + margin.left)
		);
	
	// lines
	if (response.direction === "down") {
		
		var plot = svg.select("#plot")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
			
	} else {
		
		var plot = svg.select("#plot")
		
		plot.transition().duration(DURATION)
			.attr("transform", `translate(${margin.left}, ${margin.top})`);
	
	}
	
	// plot lines
	line = d3.line()
		.x(d => xScale(d.year))
		.y(d => yScale(d.MYE));
	
	if (response.direction === "down" && d3.select("#chart1-line").empty()) {
		
		path = plot.append("path")
		  .datum(data)
		    .attr("id", "chart1-line")
			.attr("class", "line")
			.attr("fill", "none")
			.attr("stroke", "#313695")
			.attr("d", line);
		
		var totalLength = path.node().getTotalLength();
		
		path.attr("opacity", 1)
			.attr("stroke-dasharray", totalLength + " " + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition().duration(DURATION)
			.attr("stroke-dashoffset", 0);
			
	} else {
		
		plot.selectAll(".line")
		  .datum(data)
			.transition().duration(DURATION)
			.attr("id", "chart1-line")
			.attr("d", line);
			
	}
	
	// title, caption
	const header = svg.select("#header");
	const footer = svg.select("#footer");
	
	if (response.direction === "down") {
		
		header.selectAll(".chartTitle")
		  .data([{"label": "Estimated population of Northern Ireland, mid-2002 to mid-2018"}])
			.enter()
		  .append("text")
			.text(d => d.label)
			.attr("x", 0)
			.attr("y", margin.top - 20)
			.attr("text-anchor", "start")
			.attr("class", "chartTitle");
		
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
		
	} else {
		
		header.selectAll(".chartTitle")
		  .data([{"label": "Estimated population of Northern Ireland, mid-2002 to mid-2018"}])
		    .transition().duration(DURATION)
		  .text(d => d.label);
		
		footer.selectAll(".captionText")
		  .data([{"label": "Source: Northern Ireland Statistics and Research Agency"}])
		    .transition().duration(DURATION)
		  .text(d => d.label);
		  
	}
	
	// line labels
	
	var labelData = data.filter(d => d.year === 2018);
	
	if (response.direction === "down") {
		
		plot.selectAll(".lineLabel")
		  .data(labelData)
			.enter()
			.append("text")
			.attr("opacity", 0)
			.attr("class", "lineLabel")
			.attr("x", d => xScale(2018.2))
			.attr("y", d => yScale(d.MYE))
			.text(d => d3.format(",")(d.MYE))
			.attr("dy", "0.4em")
		  .transition().duration(DURATION)
			.attr("opacity", 1);
			
	} else {
		
		plot.selectAll(".lineLabel")
		  .data(labelData)
			.transition().duration(DURATION)
			.attr("class", "lineLabel")
			.attr("x", d => xScale(2018.2))
			.attr("y", d => yScale(d.MYE))
			.attr("dy", "0.4em")
			.text(d => d3.format(",")(d.MYE));
	
	}

	
}