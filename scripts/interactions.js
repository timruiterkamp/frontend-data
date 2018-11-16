import { filterAllData } from './stateData.js'
import { map } from './mapbox.js'

// get all selectors
const randomCountry = findElement('#nextItem')
const flyToLocation = findElement('#flyToLocation')
const mapIntro = findElement('.map-intro')
const mapSection = findElement('.map-section')

filterAllData.then(data => {
	initRandomCountrySelector(data)
})

// Event listeners
flyToLocation.addEventListener('click', () => {
	mapIntro.style = 'display: none;'
	styleBeforeElement('#map:before', {
		display: 'none'
	})
	map.flyTo({
		zoom: 4,
		bearing: 0,
		speed: 0.7,
		curve: 1
	})
	setTimeout(() => {
		mapSection.style = 'transform: translateX(0);'
	}, 750)
})

function initRandomCountrySelector(data) {
	randomCountry.addEventListener('click', () => {
		const randomCountry = data[Math.floor(Math.random() * data.length)]
		map.flyTo({ center: [randomCountry.long, randomCountry.lat] })
	})
}

function onchange() {
	selectValue = d3.select('#mapDataFilter').property('value')
	d3.select('body')
		.append('p')
		.text(selectValue + ' is the last selected option.')
}

function findElement(d) {
	return document.querySelector(d)
}

// Solution by https://stackoverflow.com/questions/7330355/javascript-set-css-after-styles/7330454#7330454
const styleBeforeElement = (function(style) {
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
