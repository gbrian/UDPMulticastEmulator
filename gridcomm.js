var gridcomm = function(config){
	config = config || {};
	var PORT = config.port || 11000;
	var HOST = config.host || '0.0.0.0';
	var logger = config.logger || function(){};
	var oThis = null;
	return oThis = {
		events: {},
		client: null,
		connect: function(){
			var dgram = require('dgram');
			oThis.client = dgram.createSocket('udp4');
			oThis.client.on('listening', function () {
				var address = oThis.client.address();
				console.log('UDP Client listening on ' + address.address + ":" + address.port);
				oThis.client.setBroadcast(true)
				oThis.client.setMulticastTTL(128); 
				oThis.client.addMembership('224.5.6.7',HOST);
			});

			oThis.client.on('message', function (message, remote) {   
				ProcessMessage(message, remote);
			});
			function ProcessMessage(msg, remote){
				var onEvent = oThis.events['event'];
				if(onEvent){
					var event = JSON.parse(msg);
					onEvent(event.channel, remote, event.data);
				}
				var onMsg = oThis.events['message'];
				if(onMsg)	
					onMsg(remote, msg);
				logger("[New UDP message from]: " + remote.address + " " + msg);
			}
			oThis.client.bind(PORT, HOST);
			return oThis;
		},
		send: function(data){
			var message = new Buffer(data);
			oThis.client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
				var onErr = oThis.events['error'];
				if (err && onErr) onErr(err);
				logger('[UDP message sent to]:' + HOST +':'+ PORT);
				oThis.client.close();
			});
		},
		on: function(event, callback){
			oThis.events[event] = callback;
			return oThis;
		}
	}
}
if(typeof(module) != 'undefined')
	module.exports = gridcomm;