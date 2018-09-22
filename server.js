// Denis test-map 2018

// server command line: ./readfile.sh <heatmapfile> | node server.js <lab> <vehicles> <rate>
// *Lab = Type of simulation. Valid Values: 1, 2, both. Default: both 
// *Vehicles = Number of vehicles to track. Defaul: 10
// *Rate = Vehicles real refresh interval in seconds. Default: 60
// example: ./readfile.sh test.csv | node server.js both 10 2

// client URL: localhost:8080


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
const http = require('http');
const express = require('express');
const WSS = require('ws').Server;
const protobuf = require("protobufjs/minimal");

//const path = require('path');
//const app = express().use(express.static(path.join(__dirname, 'public')));
const app = express().use(express.static('public'));
const server = http.createServer(app);

server.listen(PORT);
const wss = new WSS({ server });
wss.on('connection', function(socket) {
  
	console.log('Opened connection! Total clients = '  + wss.clients.length);
	
	var lab1 = require('./lab1');
	var lab2 = require('./lab2');
	
	socket.on('close', function() {
      console.log('Closed connection! Total clients = '  + wss.clients.length);
	  if ((lab == '1' || lab == 'both') && wss.clients.length == 0){ 
		lab1.close(process.stdin);
	  }
	  if (lab == '2' || lab == 'both'){
		lab2.close();
	  }
	});
 
 	if (lab == '1' || lab == 'both') {
 		lab1.start(process.stdin, socket, sendPacket);
	}
	if (lab == '2' || lab == 'both') {
		// input file
		const filename = 'realtimelocation.csv';
		console.log('Input file = ' + filename);
		// Number of vehicles to track
		const MAX_VEHICLES = ((process.argv.length > 3 && !isNaN(process.argv[3])) ? parseInt(process.argv[3]) : 10);
		console.log('Number of vehicles to track = ' + MAX_VEHICLES);
		// Number of vehicles to track
		const REFRESH_RATE = ((process.argv.length > 4 && !isNaN(process.argv[4])) ? parseInt(process.argv[4]) : 60);
		console.log('Vehicles real refresh rate = ' + REFRESH_RATE);
				
		lab2.start(MAX_VEHICLES, REFRESH_RATE, filename, socket, sendPacket);	
	}
	
  });

var sendPacket = function(socket, msg){
	
	if (socket.readyState != socket.OPEN) //  socket is close
		return;

	// protobuf writing
	var buffer = protobuf.Writer.create()
		.uint32((1 << 3 | 2) >>> 0) // id 1, wireType 2
		.string(msg)
	.finish();

	try {
		socket.send(buffer);
		//console.log('Sent: ' + msg);
	}
	catch(err) {
		console.log('Error when trying to send message: ' + err);
	}	
}

var broadcast = function(msg) {
	wss.clients.forEach(function(socket) {
		socket.send(msg);
		//console.log('Sent: ' + msg);
	});
}
