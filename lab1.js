// Denis test-map 2018

// Around x risk areas (Heat map) updated every second 	

const readline = require('readline');
// inputStream reader
var lab1_lineReader;

exports.close = function(inputStream){	
  	lab1_lineReader.close();
	inputStream.pause();
}

exports.start = function(inputStream, socket, sendPacket){	
	inputStream.resume();
	inputStream.setEncoding('utf8');    
	lab1_lineReader = readline.createInterface({
	  input: inputStream
	});

	lab1_lineReader.on('line', function (line) {
	
		if (line == null || line == '') // nothing to send
			return; 
		sendPacket(socket, 'm1,' + line);
	});
}