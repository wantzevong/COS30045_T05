const datasetFiles = {
	tvEnergy: "data/Ex5_TV_energy.csv",
	tvEnergy55Inch: "data/Ex5_TV_energy_55inchtv_byScreenType.csv",
	tvEnergyAllSizes: "data/Ex5_TV_energy_Allsizes_byScreenType.csv",
	spotPrices: "data/Ex5_ARE_Spot_Prices.csv"
};

Promise.all(
	Object.entries(datasetFiles).map(([name, path]) =>
		d3.csv(path).then(data => [name, data])
	)
)
	.then(entries => {
		window.datasets = Object.fromEntries(entries);
		console.log("Datasets loaded:", window.datasets);
		drawScatterPlot(window.datasets.tvEnergy);
		drawDonutChart(window.datasets.tvEnergyAllSizes);
	})
	.catch(error => console.error("Unable to load datasets:", error));
