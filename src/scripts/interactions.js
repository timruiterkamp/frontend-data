import { filterAllData } from './stateData.js'
import { map, generateChartWithCountryInfo } from './index.js'
import app from './vueSetup'

// get all selectors
const randomCountry = findElement('#nextItem')
const flyToLocation = findElement('#flyToLocation')
const mapSection = findElement('.map-section')

filterAllData.then(data => {
	initRandomCountrySelector(data)
})

// Event listeners
flyToLocation.addEventListener('click', () => {
	app.init = false
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
		app.showCountryInfo = true
		app.country = randomCountry.country
		app.debt = randomCountry.debt
		app.population = randomCountry.population[0].value
		app.currGeoLocation = {
			lat: randomCountry.lat,
			long: randomCountry.long
		}
		app.selectedCountryProducts = randomCountry.food

		generateChartWithCountryInfo(randomCountry)

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
