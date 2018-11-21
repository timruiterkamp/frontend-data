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
		loaded: true
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
		},
		setCenter: () => {
			state.data.map
				? state.data.map.flyTo({
						pitch: 0,
						center: [10.214134, 47.440152],
						zoom: 3
				  })
				: ''
		},
		setOverviewClickedStatus: () => {
			state.data.overviewIsClicked = !state.data.overviewIsClicked
		}
	}
})
