function drawScatterPlot(rows) {
	const chart = document.querySelector("#chart1");
	const data = rows
		.map(row => ({
			energy: Number(row.energy_consumpt),
			rating: Number(row.star2)
		}))
		.filter(row => Number.isFinite(row.energy) && Number.isFinite(row.rating));

	const width = chart.clientWidth - 32;
	const height = chart.clientHeight - 32;
	const margin = { top: 42, right: 20, bottom: 58, left: 66 };
	const plotWidth = width - margin.left - margin.right;
	const plotHeight = height - margin.top - margin.bottom;
	const svg = d3.select(chart)
		.selectAll("svg")
		.data([null])
		.join("svg")
		.attr("width", width)
		.attr("height", height);

	svg.selectAll("*").remove();
	svg.append("text")
		.attr("x", width / 2)
		.attr("y", 22)
		.attr("text-anchor", "middle")
		.attr("font-size", 16)
		.attr("font-weight", 600)
		.text("TV energy consumption vs. star rating");

	const plot = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);
	const x = d3.scaleLinear()
		.domain([0, d3.max(data, row => row.energy)])
		.nice()
		.range([0, plotWidth]);
	const y = d3.scaleLinear()
		.domain(d3.extent(data, row => row.rating))
		.nice()
		.range([plotHeight, 0]);

	plot.append("g")
		.attr("transform", `translate(0,${plotHeight})`)
		.call(d3.axisBottom(x));
	plot.append("g").call(d3.axisLeft(y));
	plot.selectAll("circle")
		.data(data)
		.join("circle")
		.attr("cx", row => x(row.energy))
		.attr("cy", row => y(row.rating))
		.attr("r", 3.5)
		.attr("fill", "#147d78")
		.attr("fill-opacity", 0.65);

	plot.append("text")
		.attr("x", plotWidth / 2)
		.attr("y", plotHeight + 44)
		.attr("text-anchor", "middle")
		.text("Energy consumption (kWh/year)");
	plot.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -plotHeight / 2)
		.attr("y", -48)
		.attr("text-anchor", "middle")
		.text("Star rating (star2)");
}

window.addEventListener("resize", () => {
	if (window.datasets?.tvEnergy) {
		drawScatterPlot(window.datasets.tvEnergy);
	}
});
