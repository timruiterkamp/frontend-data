const state = {
	data: {
		country: '',
		debt: '',
		population: '',
		total: [],
		showCountryInfo: false,
		init: true,
		map: null,
		currGeoLocation: [],
		overviewIsClicked: false,
		loaded: true,
		countryItems: [],
		currentDebtPerCitizen: 0,
		pastDebtPerCitizen: 0,
		selectedCountryProducts: [],
		barchartIsDrawn: false
	}
}

const app = new Vue({
	el: '#app',
	data: state,
	methods: {
		closeCountryInfo: () => {
			this.showCountryInfo = false
			document.querySelector('.map-section').style =
				'width: 30vw; transform: translateX(0)'
			if (this.map) {
				this.map.flyTo({
					pitch: 0,
					zoom: 4
				})
			}
		},
		formatNumbersByDots: data => {
			return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
		},
		setCenter: () => {
			this.map
				? this.map.flyTo({
						pitch: 0,
						center: [10.214134, 47.440152],
						zoom: 4
				  })
				: ''
		},
		setOverviewClickedStatus: () => {
			this.overviewIsClicked = !this.overviewIsClicked
		}
	}
})

export default app
