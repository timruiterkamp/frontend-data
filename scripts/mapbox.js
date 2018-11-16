mapboxgl.accessToken =
	'pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w'

import { filterAllData } from './stateData.js'

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/noclue4u/cjoeoyn8u0htn2sobi8b7qy5k',
	center: [10.214134, 47.440152],
	maxZoom: 10,
	minZoom: 3,
	zoom: 2
	// maxBounds: bounds
})

const container = map.getCanvasContainer()
const svg = d3.select(container).append('svg')

filterAllData.then(res => {
	generateListWithCountries('#countries', res.map(d => d)),
		generateInformationTips('circle', res.map(d => d))
})

function generateListWithCountries(selection, d) {
	console.log(d)
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
						center: [d.long, d.lat]
					})
				)
		)
}

function generateInformationTips(selection, d) {
	console.log(d)
	const dots = svg.selectAll(selection).data(d)

	dots.enter()
		.append('circle')
		.attr({ cx: d => 100, cy: d => 100 })

	// dots.enter()
	// 	.append('circle')
	// 	.classed('dot', true)
	// 	.attr('r', 1)
	// 	.style({
	// 		fill: '#0082a3',
	// 		'fill-opacity': 0.6,
	// 		stroke: '#004d60',
	// 		'stroke-width': 1
	// 	})
	// 	.transition()
	// 	.duration(1000)
	// 	.attr('r', 6)
}

export { map }
