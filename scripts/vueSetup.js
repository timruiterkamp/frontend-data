const state = {
	data: {
		country: '',
		debt: '',
		population: '',
		total: [],
		showCountryInfo: false,
		currentYearSelection: 2016,
		init: true,
		map: null,
		setCountryInformationWidth: 'decrease'
	}
}

const app = new Vue({
	el: '#app',
	data: state,
	methods: {
		closeCountryInfo: () => {
			state.data.showCountryInfo = false
			document.querySelector('.map-section').style =
				'width: 30vw; transform: translateX(0)'
			if (state.data.map) {
				state.data.map.flyTo({
					pitch: 0,
					zoom: 4
				})
			}
		}
	}
})
