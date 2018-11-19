const files = [
	'../data/worldGeoCodes.csv',
	'../data/europeDebt.csv',
	'../data/totalPopulation.csv'
]

const filterAllData = Promise.all(files.map(url => d3.csv(url)))
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
				population: items.values.filter(d =>
					d.value > 500 ? d.value : ''
				),
				lat: items.values
					.map(geolocation =>
						typeof geolocation.value == 'object'
							? geolocation.value[0].lat
							: ''
					)
					.pop(),
				long: items.values
					.map(geolocation =>
						typeof geolocation.value == 'object'
							? geolocation.value[0].long
							: ''
					)
					.pop()
			}))

		return filterByCountry
	})
	.catch(err => err)

const checkIfObject = d => typeof d == 'object'

export { filterAllData, checkIfObject }
