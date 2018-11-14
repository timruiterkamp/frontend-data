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
			.map(d =>
				d.values.map(items => ({
					key: items.GEO,
					debt: items.Value,
					...items
				}))
			)

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
		const filterByCountry = d3
			.nest()
			.key(d => d.key)
			.entries(filteredWorldData)
			.filter(filterByName => filterByName.key.length > 2)
			.filter(filterByData => filterByData.values.length > 2)
			.map(items => ({
				country: items.key,
				debt: items.values.filter(d => d.UNIT == 'Million euro'),
				lat: items.values.map(geolocation =>
					typeof geolocation.value == 'object'
						? geolocation.value[0].lat
						: ''
				),
				long: items.values.map(geolocation =>
					typeof geolocation.value == 'object'
						? geolocation.value[0].long
						: ''
				)
			}))

		console.log('filterByCountry', filterByCountry)
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
