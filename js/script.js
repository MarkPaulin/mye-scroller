/*
	comments and things
*/


var container = d3.select("#scroll");
var graphic = container.select(".scroll__graphic");
var chart = graphic.selectAll(".plotArea");
var text = container.select(".scroll__text");
var step = text.selectAll(".step");

var scroller = scrollama();

function handleResize() {
	
	// update height of step elements
	var stepHeight = Math.floor(window.innerHeight * 0.9);
	step.style("height", stepHeight + "px");

	// update height of graphic element
	var bodyWidth = d3.select("body").node().offsetWidth;

	graphic.style("height", window.innerHeight + "px");

	// update width of chart
	var chartMargin = 10;
	var textWidth = text.node().offsetWidth;
	var chartWidth = graphic.node().offsetWidth - textWidth - chartMargin;
	var chartHeight = Math.floor(chartWidth * 0.66);

	chart.style("width", chartWidth + "px")
		.style("height", chartHeight + "px");

	// update dimensions of svg elements
	var svg = d3.select(".plotArea is-active").select("svg");

	svg.attr("width", chartWidth + "px")
		.attr("height", chartHeight + "px");

	// tell scrollama to update new element dimensions
	scroller.resize();
}

function handleStepEnter(response) {

	// change class for current text to active
	step.classed("is-active", false);
	step.classed("is-active", function(d, i) {
		return i === response.index;
	});

	// update svgs
	// put in functions here
	switch(response.index) {
		case 0:
			makePlot1(data_1, response);
			break;
		case 1:
			makePlot2(data_2, response);
			break;
		case 2:
			makePlot3(data_3, response);
			break;
		case 3:
			makePlot4(data_4, response);
			break;
		case 4:
		    toggleChart(response);
			enterPlot5(map_data, data_5);
			break;

	}

	handleResize();
}

function toggleChart(response) {

	chart.classed("is-active", false);

	if (response.index === 4) {
		chart.classed("is-active", function(d, i) {
			return i === 1;
		});
	} else {
		chart.classed("is-active", function(d, i) {
			return i === 0;
		});
	}

}

function setupStickyfill() {
	d3.selectAll(".sticky").each(function() {
		Stickyfill.add(this);
	});
}

function scroll_init() {
	setupStickyfill();

	handleResize();

	scroller.setup({
			container: document.querySelector("#scroll"),
			graphic: ".scroll__graphic",
			text: ".scroll__text",
			step: ".scroll__text .step",
			offset: 0.5,
			debug: false,
		})
		.onStepEnter(handleStepEnter);

	window.addEventListener("resize", handleResize);
}

Promise.all([
	d3.json("data/clean_data/chart1.json"),
	d3.json("data/clean_data/chart2.json"),
	d3.json("data/clean_data/chart3.json"),
	d3.json("data/clean_data/chart4.json"),
	d3.json("data/clean_data/simple_lgd.json"),
	d3.json("data/clean_data/chart5.json")
]).then(results => {

	this.data_1 = results[0];
	this.data_2 = results[1];
	this.data_3 = results[2];
	this.data_4 = results[3];
	this.map_data = results[4];
	this.data_5 = results[5];

	scroll_init();
	svg_init();

}).catch(error => {
	console.log(error);
	document.getElementById("errMsg").innerHTML = error;
});
