
var UDPMulticastEmulator = require('./UDPMulticastEmulator.js')();
var gridcomm = require('./gridcomm.js')({logger: console.log});
gridcomm.connect();

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
switch(process.argv[2]){
	case 'server':
		UDPMulticastEmulator.server(1234, function(msg){
			console.log("Server received: " + msg);
		});
		break;
	case 'client':
		UDPMulticastEmulator.client("http://localhost:1234", function(msg){
			console.log("Received: " + msg);
		});
		var readline = require('readline');
		var rl = readline.createInterface(process.stdin, process.stdout);
		rl.setPrompt('guess> ');
		rl.prompt();
		rl.on('line', function(line) {
			if (line.length === 0) rl.close();
			else {
				gridcomm.send(line);
				rl.prompt();
			}
		}).on('close',function(){
			process.exit(0);
		});
		break;
}
