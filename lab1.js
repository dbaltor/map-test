/* Denis test-map 2018

   Around x risk areas (Heat map) updated every second
*/


exports.start = function(lab1_lineReader, socket, sendPacket){	
	lab1_lineReader.on('line', function (line) {
	
		if (line == null || line == '') // nothing to send
			return; 
		sendPacket(socket, 'm1,' + line);
	});
}