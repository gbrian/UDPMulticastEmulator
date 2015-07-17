/*
 * Multicast UDP simulator
 * Simulates UDP transmissions on an environment where UDP messages can not be used (cloud)
 * The different systems are connected through TCP and passed messages are posted locally to UDP
 * Connection model P2P
 */
 var UDPMulticastEmulator = function(){
	var oThis = null;
	var channel = 'UDP';
	return oThis = {
		socket: null,
		client: function(endpoint, callback){
			oThis.socket = require('socket.io-client')(endpoint);
			if(callback)
				oThis.socket.on(channel, callback);
			require('./gridcomm.js')()
				.on('message', function(remote, msg){
					oThis.send(msg);
				})
				.connect();
		},
		send: function(msg){
			if(!oThis.socket)
				throw "Client not connected";
			oThis.socket.emit(channel, msg);
		},
		server: function(port, callback){
			var io = require('socket.io')(port);
			io.on('connection', function(socket){
				socket.on(channel, function(msg){
					if(callback) callback(msg);
					socket.broadcast.emit(channel, msg);
				});
			});
		}
	};
 }
 
if(typeof(module) !== "undefined"){
	module.exports = UDPMulticastEmulator;
}