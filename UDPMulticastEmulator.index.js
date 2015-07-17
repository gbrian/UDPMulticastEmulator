var UDPMulticastEmulator = require('./UDPMulticastEmulator.js')();

// __MAIN__
console.log("Running UDPMulticastEmulator __MAIN__");
var argn = 2;
if(process.argv[2] == 'server'){
	console.log("Running UDPMulticastEmulator as server");
	var port = process.argv[3];
	argn++;
	if(!port){
		port = 1234;
	}else
		argn++;
	UDPMulticastEmulator.server(port);
}
console.log("Running UDPMulticastEmulator as client");
UDPMulticastEmulator.client(process.argv[argn]);