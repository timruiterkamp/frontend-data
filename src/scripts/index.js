mapboxgl.accessToken =
	'pk.eyJ1Ijoibm9jbHVlNHUiLCJhIjoiY2pvZWY2ZTA5MXdkbjN3bGVicm1hZDNvZCJ9.kIU-GIm7Cl36xhEFLaPU1w'

import { filterAllData } from './stateData.js'
import app from './vueSetup'
// init mapbox
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
	app.map = map
	app.loaded = true

	filterAllData
		.then(res => {
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
			.duration(750)
			.attr('r', d => {
				if (selectOption == 'totalDebt') {
					return Math.sqrt((+d.debt[1] / 10e10) * 100) + 3
				} else if (selectOption == 'totalPopulation') {
					return d.population.length
						? Math.sqrt((+d.population[0].value / 10e6) * 100) + 3
						: 0
				} else if (selectOption == 'totalDebtPerCitizen') {
					return d.population.length
						? Math.sqrt(
								(+d.debt[1] /
									10e10 /
									(+d.population[0].value / 10e6)) *
									100
						  ) + 3
						: 0
				} else {
					return Math.sqrt((+d.debt[1] / 10e10) * 100) + 3
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
	const select = d3
		.select(selection)
		.append('select')
		.attr('class', 'countrySelection')
		.on('change', e => {
			const value = d3.select('.countrySelection').property('value')
			return d
				.filter(country => country.country == value)
				.map(d => toggleCountryInfo(d))
		})

	select
		.selectAll('option')
		.data(d.map(country => country.country))
		.enter()
		.append('option')
		.text(d => d)
}

function toggleCountryInfo(d) {
	calculateDebtPerPerson(d)
	setCountryInformationWidth('increase')
	showCountryInformation(d)

	if (app.showCountryInfo) {
		generateChartWithCountryInfo(d)
	}

	map.flyTo({
		center: [
			app.currGeoLocation.long,
			app.currGeoLocation.lat
		],
		zoom: currentZoomLevel * 2,
		offset: [-300, 0],
		pitch: 30,
		curve: 2,
		speed: 0.5
	})
}

function showCountryInformation(data) {
	app.showCountryInfo = true
	app.country = data.country
	app.debt = data.debt
	app.population = data.population[0].value
	app.currGeoLocation = { lat: data.lat, long: data.long }
	app.selectedCountryProducts = data.food
}

function calculateDebtPerPerson(data) {
	const pastDebtInEuros = data.debt[0] ? data.debt[0] : 0
	const currentDebtInEuros = data.debt[1] ? data.debt[1] : data.debt
	const population = data.population[0].value ? data.population[0].value : ''
	const currentDebt = (currentDebtInEuros / population).toFixed(2)
	const pastDebt = (pastDebtInEuros / population).toFixed(2)

	app.currentDebtPerCitizen = currentDebt
	app.pastDebtPerCitizen = pastDebt
}

function generateChartWithCountryInfo(data) {
	const debtCurrentYear = []
	const debtPastYear = []

	data.food.map(food => {
		const newFoodObject = {
			debt: Number(
				(app.currentDebtPerCitizen / food.price).toFixed(0)
			),
			...food
		}
		const pastFoodObject = {
			debt: Number(
				(app.pastDebtPerCitizen / food.price).toFixed(0)
			),
			...food
		}
		debtCurrentYear.push({ key: 2017, ...newFoodObject })
		debtPastYear.push({ key: 2016, ...pastFoodObject })
	})
	const debtPerYear = [].concat(debtPastYear, debtCurrentYear)

	if (debtPerYear) {
		drawBarChart(debtPerYear)
	}
}

function drawBarChart(data) {
	console.log(data)
	//chart based on https://bl.ocks.org/mbostock/3887051. Thanks Mike Bostock
	const margin = { top: 60, right: 20, bottom: 30, left: 40 }
	const width = 450 - margin.left - margin.right
	const height = 400 - margin.top - margin.bottom

	const svg = d3.select('.countryDebtChart')

	if (!app.barchartIsDrawn) {
		const g = svg
			.append('g')
			.attr('class', 'layer')
			.attr(
				'transform',
				'translate(' + margin.left + ',' + margin.top + ')'
			)
	}

	const g = svg.select('.layer')

	const x0 = d3
		.scaleBand()
		.rangeRound([0, width])
		.paddingInner(0.1)
	const x1 = d3.scaleBand().padding(0.05)
	const y = d3.scaleLinear().rangeRound([height, 0])
	const z = d3.scaleOrdinal().range(['#F7E3AF', '#F7AF9D', '#C08497'])
	x0.domain(data.map(d => d.key))
	x1.domain(data.map(d => d.name)).rangeRound([0, x0.bandwidth()])
	y.domain([0, d3.max(data, d => d.debt)]).nice()

	const structuredData = d3
		.nest()
		.key(d => d.key)
		.entries(data)

	g.append('g')
		.selectAll('g')
		.data(structuredData)
		.enter()
		.append('g')
		.attr('class', 'bar')
		.attr('transform', d => 'translate(' + x0(d.key) + ',0)')
		.selectAll('rect')
		.data(d => d.values.map(items => ({ key: items.key, ...items })))
		.enter()
		.append('rect')
		.attr('x', d => x1(d.name))
		.attr('y', d => y(d.debt))
		.attr('width', x1.bandwidth())
		.attr('height', d => height - y(d.debt))
		.attr('fill', d => z(d.name))
		.on('mouseover', function(d) {
			d3.select('#tooltip')
				.style('right', 2 + 'vw')
				.style('top', 48 + 'vh')
				.select('#value')
				.text(
					`
					every citizin should buy / sell ${d.debt} ${d.name} to pay off the debt.
					The price of a ${d.name} is €${d.price}`
				)

			d3.select('#tooltip').classed('hidden', false)
		})
		.on('mouseout', () => d3.select('#tooltip').classed('hidden', true))

	if (!app.barchartIsDrawn) {
		g.append('g')
			.attr('class', 'xAxis')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x0))
			.append('text')
			.attr('fill', '#fff')
			.attr('font-weight', 'bold')
			.attr('text-anchor', 'start')
			.attr('transform', `translate(${width},0)`)
			.text('Years')

		g.append('g')
			.attr('class', 'yAxis')
			.call(d3.axisLeft(y).ticks(null, 's'))
			.append('text')
			.attr('x', 2)
			.attr('y', y(y.ticks().pop()) + 0.5)
			.attr('dy', '0.32em')
			.attr('fill', '#fff')
			.attr('font-weight', 'bold')
			.attr('text-anchor', 'start')
			.text('Amount')
	}

	g.select('.xAxis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x0))
		.append('text')
		.attr('fill', '#fff')
		.attr('font-weight', 'bold')
		.attr('text-anchor', 'start')
		.attr('transform', `translate(${width},0)`)
		.text('Years')

	g.select('.yAxis')
		.call(d3.axisLeft(y).ticks(null, 's'))
		.append('text')
		.attr('x', 2)
		.attr('y', y(y.ticks().pop()) + 0.5)
		.attr('dy', '0.32em')
		.attr('fill', '#fff')
		.attr('font-weight', 'bold')
		.attr('text-anchor', 'start')
		.text('Amount')

	app.barchartIsDrawn = true
	function update(data) {
		const structuredData = d3
			.nest()
			.key(d => d.key)
			.entries(data)

		x1.domain(data.map(d => d.name)).rangeRound([0, x0.bandwidth()])
		y.domain([0, d3.max(data, d => d.debt)]).nice()

		// update the y axis:
		svg.select('.yAxis')
			.transition()
			.call(d3.axisLeft(y).ticks(null, 's'))
			.duration(500)

		const barGroups = g.selectAll('g.bar').data(structuredData)
		barGroups
			.enter()
			.append('g')
			.classed('bar', true)
			.attr('transform', d => 'translate(' + x0(d.key) + ',0)')

		barGroups.exit().remove()

		const bars = g
			.selectAll('g.bar')
			.selectAll('rect')
			.data(d => d.values.map(items => ({ key: items.key, ...items })))

		bars.enter()
			.append('rect')
			.attr('x', d => x1(d.name))
			.attr('y', d => y(d.debt))
			.attr('width', x1.bandwidth())
			.attr('height', d => height - y(d.debt))
			.attr('fill', d => z(d.name))

		bars.transition()
			.duration(750)
			.attr('y', function(d) {
				return y(d.debt)
			})
			.attr('height', function(d) {
				return height - y(d.debt)
			})
	}

	update(data)
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

function setCountryInformationWidth(statement) {
	let infoWidth = document.querySelector('.map-section')
	return statement == 'increase'
		? (infoWidth.style = 'width: 45vw; transform: translateX(0)')
		: (infoWidth.style = 'width: 30vw; transform: translateX(0)')
}

export {
	map,
	generateListWithCountries,
	generateInformationTips,
	generateChartWithCountryInfo
}
