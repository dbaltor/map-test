

var split = require('split');

process.stdin.pipe(split()).on('data', function (line) {
	console.log(line)
})
