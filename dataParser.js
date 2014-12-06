/**
 * Created by haywire on 12/6/14.
 */

var Devices = require('./devices');

exports.parse = function(device, data) {

	console.log("available devices: ", Devices);
	var dev = Devices[device];
	for(var i=0; i<dev.availableFxns.length; i++) {
		var sign = dev.availableFxns[i];
		var resArray = data.toString().match(sign.regex);
		console.log("Match result: ", resArray);
		if(resArray && resArray.length) {
			console.log("Device: ", dev.deviceType, " Usage: ", dev.usage);
			return sign.resolve(resArray);
		}
	}
};

exports.identifyDeviceType = function(data) {

	// loop through all drivers available
	for(var device in Devices) {
		var dev = Devices[device];
		// loop through all the availableFxns of that driver
		for(var i=0; i<dev.availableFxns.length; i++) {
			var sign = dev.availableFxns[i];
			data = data.toString();
			console.log("data is: ", typeof data, data);
			var resArray = data.match(sign.regex);
			console.log("Match result: ", resArray);
			if(resArray && resArray.length) {
				console.log("New Device: ", dev.deviceType, "matches Usage: ", sign.usage);
				return dev.deviceType;
			}
		}
	}
	// unsupported device
	return false;
};

