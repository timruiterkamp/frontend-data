const files = [
	'../data/worldGeoCodes.csv',
	'../data/europeDebt.csv',
	'../data/totalPopulation.csv'
]

Promise.all(files.map(url => d3.csv(url)))
	.then(values => {
		const geoCodePerCountry = d3
			.nest()
			.key(d => d.name)
			.rollup(v => v.map(d => ({ long: d.longitude, lat: d.latitude })))
			.entries(values[0])

		const debtPerCountry = d3
			.nest()
			.key(d => d.TIME)
			.entries(values[1])
			.filter(d => d.key > 2015)
			.map(d => d.values.map(items => ({ key: items.GEO, ...items })))

		const populationPerCountry = d3
			.nest()
			.key(d => d['Country Name'])
			.rollup(v => v[0][2015])
			.entries(values[2])

		let filteredDataObject = [].concat(
			...debtPerCountry,
			...populationPerCountry,
			...geoCodePerCountry
		)

		return filteredDataObject
	})
	.then(filteredWorldData => {
		console.log('filteredworlddata', filteredWorldData)
		// const filterYears = d3
		// 	.nest()
		// 	.key(d => d.key)
		// 	.rollup(v => (Number(v) > 2014 ? v.value : v))
		// 	.entries(filteredWorldData)
		// console.log(filterYears)
		// d3.nest()
		// 	.key(d => d.key)
		// 	.rollup(v => console.log(v.length > 1 ? v : ''))
		// 	.entries(filteredWorldData)
	})
	.catch(err => err)

function analyze(error, data) {
	if (error) {
		console.log(error)
	}
	console.log(data)
}

function filterByYear(d) {
	return d.filter(item => item.key >= 2016)
}
var svg = d3.select('svg')
