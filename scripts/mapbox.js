mapboxgl.accessToken =
	'pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w'

const bounds = [
	[-18.095926, 25.201216], // Southwest coordinates
	[45.509126, 72.351789] // Northeast coordinates
]

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/noclue4u/cjoeoyn8u0htn2sobi8b7qy5k',
	center: [10.214134, 47.440152],
	maxZoom: 10,
	minZoom: 3
	// maxBounds: bounds
})

document.querySelector('#flyToLocation').addEventListener('click', () => {
	findElement('.map-intro').style = 'display: none;'
	styleBeforeElement('#map:before', {
		display: 'none'
	})
	map.flyTo({ zoom: 3.75 })
	setTimeout(() => {
		findElement('.map-section').style = 'transform: translateX(0);'
	}, 750)
})

document.querySelector('#nextItem').addEventListener('click', () => {
	map.flyTo({ center: [13.214134, 52.440152] })
})

function findElement(d) {
	return document.querySelector(d)
}

// Solution by https://stackoverflow.com/questions/7330355/javascript-set-css-after-styles/7330454#7330454
var styleBeforeElement = (function(style) {
	var sheet = document.head.appendChild(style).sheet
	return function(selector, css) {
		var propText = Object.keys(css)
			.map(function(p) {
				return p + ':' + css[p]
			})
			.join(';')
		sheet.insertRule(selector + '{' + propText + '}', sheet.cssRules.length)
	}
})(document.createElement('style'))
