	var stream = new EventSource("/sse");
	var log = console.log;
	var map;
	var lab2markers = new Map();

	window.onload = function() {
		//Add your Unwired Maps Access Token here (not the API token!)
		unwired.key = mapboxgl.accessToken = 'xyz';
		//Define the map and configure the map's theme
		map = new mapboxgl.Map({
			container: 'map',
			attributionControl: false, //need this to show a compact attribution icon (i) instead of the whole text
			style: unwired.getLayer("streets"), //get Unwired's style template
			zoom: 7,
			center: [-1.3402795, 52.0601807]
		});
	}

	stream.onopen = function() {
		log('Opened connection');
	  
	};

	stream.onerror = function (event) {
	  log('Error: ' + JSON.stringify(event));
	};

	window.addEventListener("beforeunload", function(e){
	  stream.close();
	  log('Closed connection');
	}, false);

	stream.onmessage = function (event) {
		log('Received Message: ' + event.data);
		var message = event.data.split(':');

		var fields = message[1]
			.slice(1,-2)
			.split(',');

		if (fields == '') //  message received is empty
			return;			
		
		var messageType = message[0].substring(1);
		if (messageType.includes('m1')) { //LAB 1 message received

			// create a DOM element for the marker
			var el = document.createElement('div');
			el.className = 'markerHeatMap';
			el.style.backgroundImage = 'url(marker_' + fields[2] + '.png)';
            el.style.width = '20px';
            el.style.height = '20px';

			// add marker to map
			new mapboxgl.Marker(el)
				.setLngLat([fields[1],fields[0]])
				.addTo(map);
		} 
		else if (messageType.includes('m2')) { //LAB 2 message received

			// create a DOM element for the marker
			var el = document.createElement('div');
			el.className = 'markerVehicle';
			
			el.addEventListener('click', function() {
				window.alert(fields[0]);
			});


			// Remove the marker if it already exists
			if (lab2markers.has(fields[0]))
				lab2markers.get(fields[0]).remove();

			// add marker to map
			var marker = new mapboxgl.Marker(el)
				.setLngLat([fields[2],fields[1]])
				.addTo(map);
			
			// store the marker by vehicle id
			lab2markers.set(fields[0],marker);
		} 
	};

