// Denis test-map
// server command line: readfile.bat <heatmapfile> | node server.js <Lab: 1,2,both. Default: both> <Vehicles. Defaul: 10> <Vehicles real refresh interval in sec. Default: 60> 
// example: readfile.bat test.csv | node server.js both 10 2
// client command line: localhost:8080

const DEFAULT_LAB = 'both';
var lab = ((process.argv.length > 2) ? process.argv[2] : DEFAULT_LAB);

switch(lab) {
    case '1':
        console.log('Lab 1 selected');
		break;
    case '2':
        console.log('Lab 2 selected');
        break;
    default:
		lab = DEFAULT_LAB;	
        console.log('Labs 1 and 2 selected');
} 

const PORT = process.env.PORT || 8080
var http = require('http');
var express = require('express');
var SSE = require('sse');
var readline = require('readline');
var LineByLineReader = require('./lib/line-by-line');

var app = express().use(express.static('public'));
var server = http.createServer(app);
var clients = [];

server.listen(PORT, function() {
  var sse = new SSE(server);
  
  sse.on('connection', function(stream) {
	clients.push(stream);
    console.log('Opened connection! Total clients = '  + clients.length);

	// stdin reader
	var lab1_lineReader;
	// file reader
	var	lab2_lineReader;
	
	stream.on('close', function() {
      clients.splice(clients.indexOf(stream), 1);
      console.log('Closed connection: ' + clients.indexOf(stream));
	  if ((lab == '1' || lab == 'both') && clients.length == 0){ 
	  	process.stdin.pause(); // pause stdin when the last client exists
		lab1_lineReader.close();
	  }
	  if (lab == '2' || lab == 'both'){
		lab2_lineReader.close();
	  }
    });

	if (lab == '1' || lab == 'both') {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');    
		lab1_lineReader = readline.createInterface({
		  input: process.stdin
		});

		lab1_lineReader.on('line', function (line) {
			var json = JSON.stringify({ m1: line });
			//broadcast(json);		//not to broadcast as each client starts reading the stream from the start
			stream.send(json);
			console.log('Sent: ' + json);

		});
	}
	if (lab == '2' || lab == 'both') {

		// Number of vehicles to track
		const MAX_VEHICLES = ((process.argv.length > 3 && !isNaN(process.argv[3])) ? parseInt(process.argv[3]) : 10);
		console.log('Number of vehicles to track = ' + MAX_VEHICLES);
		// Number of vehicles to track
		const REFRESH_RATE = ((process.argv.length > 4 && !isNaN(process.argv[4])) ? parseInt(process.argv[4]) : 60);
		console.log('Vehicles real refresh rate = ' + REFRESH_RATE);
		
		lab2_lineReader = new LineByLineReader('realtimelocation.csv');
		
		const ONE_MINUTE = new Date("1970-01-01T00:01:00Z").getTime();
		const SLEEP = REFRESH_RATE * 1000; // milliseconds
		var vehicles = new Array(MAX_VEHICLES);
		var stored_vehicles = 0;
		var vehicles_to_send = MAX_VEHICLES;
		var last_time = '';

		lab2_lineReader.on('line', function (line) {

			var msg = line.split(',');
			var time = msg[0];
			var vehicle = msg[1];
			var lat = msg[2];
			var longi = msg[3];
			var msg2send = vehicle + ',' + lat + ',' + longi;
			
			// add current vehicle to the to send list
			if (stored_vehicles <= MAX_VEHICLES && !vehicles.includes(vehicle)) {
				vehicles.push(vehicle);
				stored_vehicles++;
			}
			
			//  vehicle listed to send
			if (vehicles.includes(vehicle)) {
				
				// MAX_VEHICLES not exceeded 
				if (vehicles_to_send > 0) {
					
					// send message
					var json = JSON.stringify({ m2: msg2send });
					//broadcast(json); //not to broadcast as each client starts reading the stream from the start		
					stream.send(json);
					console.log('Sent: ' + json);
					
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
						var json = JSON.stringify({ m2: msg2send });
						//broadcast(json); //not to broadcast as each client starts reading the stream from the start		
						stream.send(json);
						console.log('Sent: ' + json);
						
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
	
  });
});


var broadcast = function(json) {

  clients.forEach(function(stream) {
    stream.send(json);
    console.log('Sent: ' + json);
  });
}
