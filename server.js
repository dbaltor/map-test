/* Denis test-map 2018

 server command line: ./readfile.sh <heatmapfile> | node server.js -f=<file> -l=<lab> -v=<vehicles> -v=<rate>
 *File = Input filename of vehicles' locations
 *Lab = Type of simulation. Valid Values: 1, 2, both. Default: both 
 *Vehicles = Number of vehicles to track. Defaul: 10
 *Rate = Vehicles real refresh interval in seconds. Default: 60
 example: ./readfile.sh test.csv | node server.js both 10 2

 client URL: localhost:8080
*/

// Default lab
var LAB = 'both';
// Default filename
var FILENAME = './files/realtimelocation.csv';
// Default number of vehicles to track
var MAX_VEHICLES = 10;
// Default refresh rate in seconds
var REFRESH_RATE = 60;

// Reading command line parameters
// parameter key's length
const PARAM_KEY_LENGHT = 3;
if (process.argv.length > 2) {
  for (var i = 2; i < process.argv.length; i++) {
	arg = process.argv[i];
	if (arg.length >= PARAM_KEY_LENGHT && arg.substring(0,PARAM_KEY_LENGHT) == '-l=')
		// get lab name
		LAB = arg.substring(PARAM_KEY_LENGHT);
	else if (arg.length >= PARAM_KEY_LENGHT && arg.substring(0,PARAM_KEY_LENGHT) =='-f=')
		// get filename
		FILENAME = arg.substring(PARAM_KEY_LENGHT);
	else if (arg.length >= PARAM_KEY_LENGHT && arg.substring(0,PARAM_KEY_LENGHT) == '-v=')
		// get number of vehicles to track
		MAX_VEHICLES = (!isNaN(arg.substring(PARAM_KEY_LENGHT)) ? parseInt(arg.substring(PARAM_KEY_LENGHT)) : MAX_VEHICLES);
	else if (arg.length >= PARAM_KEY_LENGHT && arg.substring(0,PARAM_KEY_LENGHT) == '-r=')
		// get refresh rate
		REFRESH_RATE = (!isNaN(arg.substring(PARAM_KEY_LENGHT)) ? parseInt(arg.substring(PARAM_KEY_LENGHT)) : REFRESH_RATE);
  }
} 
console.log('Lab = ' + LAB);
console.log('Input file = ' + FILENAME);
console.log('Number of vehicles to track = ' + MAX_VEHICLES);
console.log('Vehicles real refresh rate (s)= ' + REFRESH_RATE);

const http = require('http');
const express = require('express');
const WSS = require('ws').Server;
//const path = require('path');
//const app = express().use(express.static(path.join(__dirname, 'public')));
const app = express().use(express.static('public'));
const server = http.createServer(app);
const protobuf = require("protobufjs/minimal");
const readline = require('readline');
const LineByLineReader = require('./lib/line-by-line');

const lab1 = require('./lab1');
const lab2 = require('./lab2');

const PORT = process.env.PORT || 8080
server.listen(PORT);
const wss = new WSS({ server });
wss.on('connection', function(socket) {
 	console.log('Opened connection! Total clients = '  + wss.clients.length);
	
	// stdin reader
	var lab1_lineReader;
	// file reader
	var	lab2_lineReader;

	
	socket.on('close', function() {
      console.log('Closed connection! Total clients = '  + wss.clients.length);
	  if ((LAB == '1' || LAB == 'both') && wss.clients.length == 0){ 
		process.stdin.pause();
		lab1_lineReader.close();
	  }
	  if (LAB == '2' || LAB == 'both'){
		lab2_lineReader.close();
	  }
	});
 
 	if (LAB == '1' || LAB == 'both') {
		process.stdin.resume();
		process.stdin.setEncoding('utf8');    
		lab1_lineReader = readline.createInterface({
		  input: process.stdin
		});	
		lab1.start(lab1_lineReader, socket, sendPacket);
	}
	if (LAB == '2' || LAB == 'both') {
		lab2_lineReader = new LineByLineReader(FILENAME);
		lab2.start(MAX_VEHICLES, REFRESH_RATE, lab2_lineReader, socket, sendPacket);	
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
