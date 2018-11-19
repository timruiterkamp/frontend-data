mapboxgl.accessToken =
	'pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w'

import { filterAllData } from './stateData.js'

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/noclue4u/cjoeoyn8u0htn2sobi8b7qy5k',
	center: [10.214134, 47.440152],
	maxZoom: 10,
	minZoom: 3,
	zoom: 3,
	doubleClickZoom: false
	// maxBounds: bounds
})

const container = map.getCanvasContainer()
const currentZoomLevel = map.getZoom()
const svg = d3
	.select(container)
	.append('svg')
	.append('g')

map.on('load', () => {
	filterAllData
		.then(res => {
			initSelectOption(res)
			// initDebtByYearSelection(res.map(d => d))
			generateListWithCountries('#countries', res.map(d => d))
			generateInformationTips(res.map(d => d))
		})
		.catch(err => console.error(err))
})

function generateListWithCountries(selection, d) {
	var ul = d3.select(selection).append('ul')

	ul.selectAll('li')
		.data(d.map(country => country.country))
		.enter()
		.append('li')
		.html(String)
		.on('click', e =>
			d
				.filter(country => country.country == e)
				.map(d =>
					map.flyTo({
						center: [d.long, d.lat],
						zoom: currentZoomLevel * 2,
						pitch: 40,
						curve: 2,
						speed: 0.5
					})
				)
		)
}

// Thanks to jorditost for showing how to display dots on mapbox
function generateInformationTips(d, selectOption) {
	const circles = svg
		.selectAll('circle')
		.data(d)
		.enter()
		.append('circle')
		.attr('r', 2)
		.on('click', d => toggleCountryInfo(d))
		.transition()
		.duration(0)
		.attr('cx', d => project([+d.long, +d.lat]).x)
		.attr('cy', d => project([+d.long, +d.lat]).y)

	// Update function
	const update = () => {
		svg.selectAll('circle')
			.attr('cx', d => project([+d.long, +d.lat]).x)
			.attr('cy', d => project([+d.long, +d.lat]).y)
			.transition()
			.duration(500)
			.attr('r', d => {
				if (selectOption == 'totaleSchuld') {
					return (
						+d.debt[0].debt.replace(',', '').split('.')[0] / 5000 +
						3 * map.getZoom()
					)
				} else if (selectOption == 'totalePopulatie') {
					return d.population.length
						? +d.population[0].value / 2000000 + 3
						: 0
				} else {
					return (
						+d.debt[0].debt.replace(',', '').split('.')[0] / 5000 +
						3 * map.getZoom()
					)
				}
			})
	}

	// Call the update function
	update()

	// Update on map interaction
	map.on('viewreset', () => update())
		.on('move', () => update())
		.on('moveend', () => update())
		.on('zoom', () => update())
}

function initSelectOption(data) {
	mapDataFilter.addEventListener('change', e => {
		generateInformationTips(data.map(d => d), e.target.value)
	})
}

function checkIfExists(data, fallback) {
	data > 1 || (data.length && data !== undefined) ? data : fallback
}

function project(coords) {
	return map.project(new mapboxgl.LngLat(+coords[0], +coords[1]))
}

function toggleCountryInfo(d) {
	map.flyTo({
		center: [d.long, d.lat],
		zoom: currentZoomLevel * 2,
		pitch: 40,
		curve: 2,
		speed: 0.5
	})

	showCountryInformation(d)
}

function showCountryInformation(data) {
	document.querySelector('.country-display').style = 'display: none;'
	document.querySelector('.country-info').style = 'display: block;'

	const infoSection = d3
		.select('.country-info')
		.append('section')
		.attr('class', 'country-information')

	infoSection
		.append('h3')
		.attr('class', 'countryName')
		.text(data.country)

	const update = () => {
		infoSection
			.append('h3')
			.attr('class', 'countryName')
			.text(data.country)

		console.log(data)
		infoSection
			.append('h4')
			.attr('class', 'Population')
			.text(`totaal aantal inwoners: ${data.population[0].value}`)

		infoSection
			.append('h4')
			.attr('class', 'Population')
			.text(`totale schuld: ${data.debt[0].debt} miljoen`)
	}
	// Call the update function
	update()
}

function initDebtByYearSelection(data) {
	const yearSelection = d3
		.select('#chooseYear')
		.append('select')
		.attr('class', 'select')
		.on('change', () => {
			const values = d3.select('.select').property('value')
			d3.select('#stateDebt')
				.data(data[0].debt)
				.enter()
				.append('p')
				.text(d => (d.TIME == values ? d.debt : ''))
			console.log(values)
		})

	const options = yearSelection
		.selectAll('option')
		.data(data[0].debt)
		.enter()
		.append('option')
		.text(d => d.TIME)
}

export { map, generateListWithCountries, generateInformationTips }
