mapboxgl.accessToken =
	'pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w'

import { filterAllData } from './stateData.js'

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/noclue4u/cjoeoyn8u0htn2sobi8b7qy5k',
	center: [10.214134, 47.440152],
	maxZoom: 10,
	minZoom: 1,
	zoom: 3
	// maxBounds: bounds
})

const container = map.getCanvasContainer()
const startZoom = map.getZoom()
const svg = d3
	.select(container)
	.append('svg')
	.append('g')
	.attr('fill', '#BBE4A0')
	.attr('stroke', '#BBE4A0')

map.on('load', () => {
	filterAllData
		.then(res => {
			generateListWithCountries('#countries', res.map(d => d))
			generateInformationTips('circle', res.map(d => d))
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
						zoom: startZoom * 2,
						pitch: 40,
						curve: 2,
						speed: 0.5
					})
				)
		)
}

// Thanks to jorditost for map.project function
function generateInformationTips(selection, d) {
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
	const update = transitionTime => {
		transitionTime =
			typeof transitionTime !== 'undefined' ? transitionTime : 0
		// console.log(map.getZoom())
		svg.selectAll('circle')
			.transition()
			.duration(transitionTime)
			.attr(
				'r',
				d =>
					+d.debt[0].debt.replace(',', '').split('.')[0] / 5000 +
					3 * map.getZoom()
			)
			.attr('cx', d => project([+d.long, +d.lat]).x)
			.attr('cy', d => project([+d.long, +d.lat]).y)
	}

	// Call the update function
	update()

	// Update on map interaction
	map.on('viewreset', () => update(0))
	map.on('move', () => update(0))
	map.on('moveend', () => update(0))
	map.on('zoom', () => update(0))
}

function project(coords) {
	return map.project(new mapboxgl.LngLat(+coords[0], +coords[1]))
}

function toggleCountryInfo(data) {
	alert(data)
}

export { map }
