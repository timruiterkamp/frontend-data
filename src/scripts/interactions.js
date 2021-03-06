import { filterAllData } from './stateData.js'
import {
	map,
	generateChartWithCountryInfo,
	toggleCountryInfo
} from './index.js'

const randomCountry = findElement('#nextItem')

function initInteractions() {
	const flyToLocation = findElement('#flyToLocation')
	const mapSection = findElement('.map-section')

	filterAllData.then(data => {
		initRandomCountrySelector(data)
	})

	// Event listeners
	flyToLocation.addEventListener('click', () => {
		state.data.init = false

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
}

function initRandomCountrySelector(data) {
	randomCountry.addEventListener('click', () => {
		const randomCountry = data[Math.floor(Math.random() * data.length)]

		if (randomCountry) {
			state.data.showCountryInfo = true
			state.data.country = randomCountry.country
			state.data.debt = randomCountry.debt
			state.data.population = randomCountry.population[0].value
			state.data.currGeoLocation = {
				lat: randomCountry.lat,
				long: randomCountry.long
			}
			state.data.selectedCountryProducts = randomCountry.food

			toggleCountryInfo(randomCountry)
		}

		document.querySelector('.map-section').style =
			'width: 45vw; transform: translateX(0)'

		map.flyTo({
			center: [randomCountry.long, randomCountry.lat],
			pitch: 40,
			zoom: 6,
			offset: [-300, 0]
		})
	})
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

export { initInteractions }
