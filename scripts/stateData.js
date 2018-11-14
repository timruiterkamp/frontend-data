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
			.rollup(v =>
				v.map(d => ({ country: d.GEO, debt: d.Value, unit: d.UNIT }))
			)
			.entries(values[1])

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
		console.log(filteredWorldData)
		d3.nest()
			.key(d => d.key)
			.rollup(v => console.log(v))
			.entries(filteredWorldData)
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
