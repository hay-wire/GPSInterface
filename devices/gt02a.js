/**
 * Created by haywire on 12/6/14.
 */

/*	DATA Format:
		LatLongs:
			(027042573071BR00141206A1904.6176N07250.8073E002.50952072.730000000000L00000000)

		Keep Alive:
 			(027042573071BP00000027042573071HSO)

		All drivers must have the following format.
		and

 */


exports.deviceType = "gt02a";	// must be same as file name


/*
 *	@params: name: optional name to identify fxns
 *	@params: regex: must have a regex to match the data to
 *	@resolve: a method with 2 arguments data, dataArr
 *			data: the data received from devices in socket.on('data', function(data) {..}) method
 *			execRes: (optional) is the object returned after executing : regex.exec(data)
 */

exports.availableFxns = [
	{	name: "gt02a:BR00",
		regex: new RegExp(/\(([0-9]+)(BR00)([^A-Z]+)(A)([0-9]{2})([0-9\.]+)([NS])([0-9]{3})([0-9\.]+)([EW])([0-9\.]{9})([0-9\.]{12})[0-9]+([L])([0-9]+)\)\s*\r*\n*/),
		resolve:  function(data, execRes) {
			// for data:
			// 		(027042573071BR00141206A1904.6176N07250.8073E002.50952072.730000000000L00000000)
			// dataArray should contain:
			//	[	0:	"(027042573071BR00141206A1904.6176N07250.8073E002.50952072.730000000000L00000000)",
			// 		1:	"027042573071",			=> imei number (should have been only 10 chars, but its 12)
			// 		2:	"BR00",					=> command word
			// 		3:	"141206",				=> date YYMMDD
			// 		4:	"A",					=> available
			// 		5:	"19", 					=> longitude degrees (0-90 only)
			// 		6:	"04.6176", 				=> longitude minutes
			// 		7:	"N",					=> longitude hemisphere
			// 		8:	"072", 					=> latitude degrees (0-180 only)
			// 		9:	"50.8073", 				=> latitude minutes
			// 		10:	"E", 					=> latitude E/W
			// 		11:	"002.50952", 			=> speed (knot/hr or km/hr)
			// 		12:	"072.73000000",			=> direction in degrees. 0=north, 90=east, 180=south, 270=west
			// 		13:	"L",					=> wtf
			// 		14:	"00000000",				=> another wtf
			// 		15:	""
			// 	]

			var lat = (parseInt(execRes[5]) + parseFloat(execRes[6])/60) * ( (execRes[7] === "N") ? 1 : -1 );
			var lng = (parseInt(execRes[8]) + parseFloat(execRes[9])/60) * ( (execRes[10] === "E") ? 1 : -1 );

			//"gpsUid=%s&msgType=locationUpdate&loc=[%s,%s]&speed=%s&direction=%s",
			// deviceId, latitude, longitude, speed, direction)
			var httpRes =
				  'gpsUid=' + execRes[1]
				+ '&msgType=locationUpdate'
				+ '&loc=['+ lat+','+ lng+']'
				+ '&speed='+ execRes[11]
				+ '&direction='+ execRes[12];

			console.log("gt02a:BP00: httpRes is: ", httpRes);
			return { err: null, httpRes: httpRes, deviceRes: null };
		}
	},
	{	name: "gt02a:BP00",
		regex: new RegExp(/\(([0-9]+)(BP00)([0-9]+)(HSO)\)\s*\r*\n*/),
		resolve: function(data, execRes) {
			// for data:
			//		(027042573071BP00000027042573071HSO)
			// execArr is:
			// [	0:	"(027042573071BP00000027042573071HSO)",
			// 		1:	"027042573071",		=> general deviceId
			// 		2:	"BP00",				=> command word
			// 		3:	"000027042573071",	=> wtf deviceId
			// 		4:	"HSO"				=> handshake code
			// ]
			//
			var deviceRes = '(' + execRes[1] + 'AP01HSO)';
			console.log("gt02a:BP00: deviceRes is ", deviceRes);
			return { err: null, httpRes: null, deviceRes: deviceRes }
		}
	}
];


