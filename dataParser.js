/**
 * Created by haywire on 12/6/14.
 */

var Devices = require('./devices');

exports.parse = function(device, data) {

	console.log("Parse: 1. Using device: ", device);
	var dev = Devices[device];
	for(var i=0; i<dev.availableFxns.length; i++) {
		var fxn = dev.availableFxns[i];
		console.log("Parse: 2. Matching for Signature: ", fxn.name);
		var resArray = data.toString().match(fxn.regex);
		console.log("Parse 3: Match result: ", resArray);
		if(resArray && resArray.length) {
			console.log("Parse 4: Resolving against Device: ", dev.deviceType, " Signature: ", fxn.name);
			var res = fxn.resolve(data, resArray);
			console.log("Parse 5: Resolved result: ", typeof res, res);
			return res;
		}
	}
	return '';
};

exports.identifyDeviceType = function(data) {

	// loop through all drivers available
	for(var device in Devices) {
		var dev = Devices[device];
		// loop through all the availableFxns of that driver
		for(var i=0; i<dev.availableFxns.length; i++) {
			var fxn = dev.availableFxns[i];
			data = data.toString();
			console.log("Identify: 1. Matching regex with data: ", fxn.regex, typeof data, data);
			var resArray = data.match(fxn.regex);
			console.log("Identify: 2. Match result: ", resArray);
			if(resArray && resArray.length) {
				console.log("Identify: 3. New Device: ", dev.deviceType, "matches name: ", fxn.name);
				return dev.deviceType;
			}
		}
	}
	// unsupported device
	return false;
};

