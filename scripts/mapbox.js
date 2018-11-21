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
})

const container = map.getCanvasContainer()
const currentZoomLevel = map.getZoom()
const svg = d3
	.select(container)
	.append('svg')
	.append('g')

map.on('load', () => {
	state.data.map = map
	state.data.loaded = true

	filterAllData
		.then(res => {
			// initDebtByYearSelection(res.map(d => d))
			initSelectOption(res)
			generateInformationTips(res.map(d => d))
			generateListWithCountries('#countries', res.map(d => d))
		})
		.catch(err => console.error(err))
})

// Thanks to jorditost for showing how to display dots on mapbox
function generateInformationTips(d, selectOption) {
	const circles = svg
		.selectAll('circle')
		.data(d)
		.enter()
		.append('circle')
		.attr('r', 2)
		// .attr('class', d => `${trimWhiteAndLowercase(d.country)}`)
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
			.duration(1500)
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

function generateListWithCountries(selection, d) {
	var select = d3
		.select(selection)
		.append('select')
		.attr('class', 'countrySelection')
		.on('change', e => {
			const value = d3.select('.countrySelection').property('value')
			return d
				.filter(country => country.country == value)
				.map(d => {
					toggleCountryInfo(d)
				})
		})

	select
		.selectAll('option')
		.data(d.map(country => country.country))
		.enter()
		.append('option')
		.text(d => d)
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
	setCountryInformationWidth('increase')
	showCountryInformation(d)
	// attractActiveClass(d.country)

	map.flyTo({
		center: [
			state.data.currGeoLocation.long,
			state.data.currGeoLocation.lat
		],
		zoom: currentZoomLevel * 2,
		offset: [-300, 0],
		pitch: 30,
		curve: 2,
		speed: 0.5
	})
}

function showCountryInformation(data) {
	state.data.showCountryInfo = true
	state.data.country = data.country
	state.data.debt = data.debt
	state.data.population = data.population[0].value
	state.data.currGeoLocation = { lat: data.lat, long: data.long }
}

function attractActiveClass(country) {
	const stateCountry = trimWhiteAndLowercase(state.data.country)
	const selectedCountry = trimWhiteAndLowercase(country)

	console.log()

	stateCountry == selectedCountry
		? document.querySelector(`.${selectedCountry}`).classList.add('pulse')
		: ''
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

function trimWhiteAndLowercase(str) {
	return str.replace(' ', '').toLocaleLowerCase()
}

export { map, generateListWithCountries, generateInformationTips }
