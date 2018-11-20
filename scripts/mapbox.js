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

state.data.map = map

const container = map.getCanvasContainer()
const currentZoomLevel = map.getZoom()
const svg = d3
	.select(container)
	.append('svg')
	.append('g')

map.on('load', () => {
	filterAllData
		.then(res => {
			// initDebtByYearSelection(res.map(d => d))
			initSelectOption(res)
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
				.map(d => {
					toggleCountryInfo(d)
				})
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
		pitch: 30,
		curve: 2,
		speed: 0.5
	})

	console.log(map.getCenter().lat)
	setCountryInformationWidth('increase')
	showCountryInformation(d)
}

function showCountryInformation(data) {
	state.data.showCountryInfo = !state.data.showCountryInfo
	state.data.country = data.country
	state.data.debt = data.debt
	state.data.population = data.population[0].value
}

// function initDebtByYearSelection(data) {
// 	const yearSelection = d3
// 		.select('#testing')
// 		.append('select')
// 		.attr('class', 'select')
// 		.on('change', () => {
// 			const values = d3.select('.select').property('value')
// 			console.log(values)
// 			state.data.currentYearSelection = values
// 		})
// 	const options = yearSelection
// 		.selectAll('option')
// 		.data(data[0].debt)
// 		.enter()
// 		.append('option')
// 		.text(d => d.TIME)
// }

function setCountryInformationWidth(statement) {
	let infoWidth = document.querySelector('.map-section')
	return statement == 'increase'
		? (infoWidth.style = 'width: 45vw; transform: translateX(0)')
		: (infoWidth.style = 'width: 30vw; transform: translateX(0)')
}

export { map, generateListWithCountries, generateInformationTips }
