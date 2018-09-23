/* Denis test-map 2018

   x moving vehicles updated every y seconds
*/

exports.start = function(MAX_VEHICLES, REFRESH_RATE, lab2_lineReader, socket, sendPacket){	
	
	const ONE_MINUTE = new Date("1970-01-01T00:01:00Z").getTime();
	const SLEEP = REFRESH_RATE * 1000; // milliseconds converted to seconds
	var vehicles = new Array(MAX_VEHICLES);
	var stored_vehicles = 0;
	var vehicles_to_send = MAX_VEHICLES;
	var last_time = '';

//	console.log('DENISSS - max vehicles = ' + vehicles_to_send);
	
	lab2_lineReader.on('line', function (line) {

		if (line == null || line == '') //  read line is empty
			return;
			
		var msg = line.split(',');
		var time = msg[0];
		var vehicle = msg[1];
		var lat = msg[2];
		var longi = msg[3];
		var msg2send = 'm2,' + vehicle + ',' + lat + ',' + longi;

	//console.log('DENISSS - vehicle = ' + vehicle);
		//console.log('DENISSS - stored_vehicles = ' + stored_vehicles);
		
		// add current vehicle to the to send list
		if (stored_vehicles < MAX_VEHICLES && !vehicles.includes(vehicle)) {
			vehicles.push(vehicle);
			stored_vehicles++;
		}

	//console.log('DENISSS - vehicles = ' + vehicles);
	
		// TRACKING ONLY ONE VEHICLE TEST
/*			if (vehicle.includes('Vehicle_847')) {
			vehicles.push(vehicle);
			stored_vehicles++;
		}*/
		
		//  vehicle listed to send
		if (vehicles.includes(vehicle)) {
			
			// MAX_VEHICLES not exceeded 
			if (vehicles_to_send > 0) {
				
				// send message
				sendPacket(socket, msg2send);				
				// decrement vehicles to send
				vehicles_to_send--;
				// record the time
				last_time = time;
				
			} else if (	new Date("1970-01-01T" + time + ":00Z").getTime() >= new Date("1970-01-01T" + last_time + ":00Z").getTime() + ONE_MINUTE) {
				// MAX_VEHICLES exceeded AND
				// the record happened at least 1 minute after the last record sent. 
				// (Allows for skiping data regarding the vehicle being monitored if the interval chosen is longer than the reads on the file)

				// pause emitting of lines...
				lab2_lineReader.pause();
				setTimeout(function () {
					// reset counter
					vehicles_to_send = MAX_VEHICLES;
					
					// send message
					sendPacket(socket, msg2send);
					//decrement vehicles to send
					vehicles_to_send--;

					// ...and continue emitting lines.
					lab2_lineReader.resume();
				}, SLEEP);

			}
		}
	});

	lab2_lineReader.on('error', function (err) {
	  // 'err' contains error object
		console.log('Error while reading the file: ' + err);
	});

	lab2_lineReader.on('end', function () {
	  // All lines are read, file is closed now.
		console.log('All lines are read, file is closed now');
	});
}