/**
 * Created by haywire on 12/6/14.
 */
//'use strict';
var net = require('net');
var http = require('http');
var dataParser = require('./dataParser');

var PORT = 7018;
var clientsCount = 0;
var clients = {};


/* make console.log write to a debug file as well */
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/logs/debug.log', {flags : 'a'});
var log_stdout = process.stdout;

debug = {};
debug.log = function(d) {
	delete arguments['0']; // remove the first argument. its already in d
	var addInfo = (JSON.stringify(arguments));
	(!arguments[1]) ?  (addInfo = '')  : null;
	log_file.write((new Date()).toString() + ':  ' +util.format(d) + ' ' + addInfo + '\n');
};




// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
var server = net.createServer(function(sock) {

	// We have a connection - a socket object is assigned to the connection automatically
	console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort + ' clients: ' + ++clientsCount);
	sock['deviceType'] = false;
	sock['identifyTries'] = 0;

	// Add a 'data' event handler to this instance of socket
	sock.on('data', function(data) {


		debug.log('Data:'+sock.remoteAddress +':'+ sock.remotePort + ': ' + data.toString().trim());
		if(!sock.deviceType) {
			// We try to identify device for max 10 times.
			if( sock.identifyTries < 3) {
				sock.identifyTries += 1;
				sock.deviceType = dataParser.identifyDeviceType(data);	// returns false if could not identify
			}
			else {
				// max tries exhausted.
				sock.write('CLOSE_MAX_TRY');
				debug.log(sock.remoteAddress +' '+ sock.remotePort  +' CLOSE_MAX_TRY');
				console.log('CLOSE_MAX_TRY');
				sock.destroy();
				return;
			}
			if(sock.deviceType !== false) {
				sock.identifyTries = 0;
			}
			else {
				console.log('UNKNOWN_DEVICE');
				debug.log(sock.remoteAddress +' '+ sock.remotePort  +' UNKNOWN_DEVICE');
				sock.write('UNKNOWN_DEVICE');
				return;
			}
		}

		// device has been already identified. process the data

		if(sock.deviceType) {
			console.log("Device Identified As: " + sock.remoteAddress +' '+ sock.remotePort + ': ', typeof sock.deviceType, sock.deviceType);
			debug.log("Device Identified As: " + sock.remoteAddress +' '+ sock.remotePort + ': ', typeof sock.deviceType, sock.deviceType);
			var res = dataParser.parse(sock.deviceType, data);
			if(!res.err) {
				if(res.httpRes) {
					var options = {
						hostname: 'localhost',
						port: 3000,
						path: '/gps/update/car',
						method: 'POST'
					};

					var httpReq = http.request(options, function(res) {
						console.log("Http StatusCode: " + sock.remoteAddress +' '+ sock.remotePort + ': ' + res.statusCode);
						debug.log("Http StatusCode: " + sock.remoteAddress +' '+ sock.remotePort + ': ', res.statusCode)
					});
					httpReq.on('error', function(e) {
						console.log("Http Error ");
						debug.log("Http Error "+ sock.remoteAddress +' '+ sock.remotePort + ': ', e);

					});
					httpReq.setHeader('Content-Length', res.httpRes.length);
					httpReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');

					httpReq.write(res.httpRes);
					httpReq.end();

				}
				if(res.deviceRes) {
					sock.write(res.deviceRes);
				}
			}
			else {
				console.log('ERR_DATAPARSE');
				debug.log('ERR_DATAPARSE : '+ sock.remoteAddress +' '+ sock.remotePort + ': '+res.err);
				sock.write('ERR_DATAPARSE');
			}
			//console.log('RES: ', res);
		}
		else {
			console.log('Unreachable code reached!!! ');
			debug.log('Unreachable code reached');
		}

	});

	// Add a 'close' event handler to this instance of socket
	sock.on('close', function(data) {
		--clientsCount;
		console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort  + ' clients: ' + clientsCount);
		debug.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort  + ' clients: ' + clientsCount);

	});

});
server.maxConnection = 1024;
server.listen(PORT, function() {
	console.log('GPS Interface listening on :'+ PORT);
	debug.log('GPS Interface listening on :'+ PORT);
});

