function drawDonutChart(rows) {
	const chart = document.querySelector("#chart2");
	const data = rows
		.map(row => ({
			technology: row.Screen_Tech,
			energy: Number(row["Mean(Labelled energy consumption (kWh/year))"])
		}))
		.filter(row => row.technology && Number.isFinite(row.energy) && row.energy > 0);

	const width = chart.clientWidth - 32;
	const height = chart.clientHeight - 32;
	const centerX = width * 0.34;
	const centerY = (height + 28) / 2;
	const radius = Math.min(height - 55, width * 0.5) / 2;
	const color = d3.scaleOrdinal()
		.domain(data.map(row => row.technology))
		.range(d3.schemeTableau10);
	const pie = d3.pie()
		.value(row => row.energy)
		.sort(null);
	const arc = d3.arc()
		.innerRadius(radius * 0.58)
		.outerRadius(radius);
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
		.attr("font-size", 14)
		.attr("font-weight", 600)
		.text("Mean energy consumption by screen technology");

	const donut = svg.append("g")
		.attr("transform", `translate(${centerX},${centerY})`);
	donut.selectAll("path")
		.data(pie(data))
		.join("path")
			.attr("d", arc)
			.attr("fill", item => color(item.data.technology))
			.attr("stroke", "#fff")
			.attr("stroke-width", 2)
		.append("title")
			.text(item => `${item.data.technology}: ${item.data.energy.toFixed(1)} kWh/year`);

	donut.append("text")
		.attr("text-anchor", "middle")
		.attr("y", -3)
		.attr("font-size", 12)
		.attr("font-weight", 600)
		.text("Energy");
	donut.append("text")
		.attr("text-anchor", "middle")
		.attr("y", 15)
		.attr("font-size", 10)
		.attr("fill", "#59636e")
		.text("kWh/year");

	const legendX = width * 0.62;
	const legendY = centerY - (data.length - 1) * 18;
	const legend = svg.append("g")
		.attr("transform", `translate(${legendX},${legendY})`)
		.selectAll("g")
		.data(data)
		.join("g")
			.attr("transform", (_, index) => `translate(0,${index * 36})`);

	legend.append("circle")
		.attr("r", 5)
		.attr("fill", row => color(row.technology));
	legend.append("text")
		.attr("x", 12)
		.attr("y", 4)
		.attr("font-size", 12)
		.text(row => row.technology);
	legend.append("text")
		.attr("x", width - legendX)
		.attr("y", 4)
		.attr("text-anchor", "end")
		.attr("font-size", 11)
		.attr("fill", "#59636e")
		.text(row => row.energy.toFixed(1));
}

window.addEventListener("resize", () => {
	if (window.datasets?.tvEnergyAllSizes) {
		drawDonutChart(window.datasets.tvEnergyAllSizes);
	}
});
