/**
 * Created by haywire on 12/6/14.
 */

/*	DATA Format:
		LatLongs:
			(027042573071BR00141206A1904.6176N07250.8073E002.50952072.730000000000L00000000)

		Keep Alive:

		All drivers must have the following format.
		and

 */


exports.deviceType = "gt02a";	// must be same as file name


/*
 *	@params: name: optional name to identify fxns
 *	@params: regex: must have a regex to match the data to
 *	@resolve: a method with 2 arguments data, dataArr
 *			data: the data received from devices in socket.on('data', function(data) {..}) method
 *			dataArr: (optional) is the object returned after executing : data.match(regex)
 */

exports.availableFxns = [
	{	name: "lat-longs",
		regex: /ss/,
		resolve:  function(data, dataArr) {
			console.log("gt02a: lat-longs: array is: ", dataArr);
			return dataArr.toString();
		}
	},
	{	name: "keep-alive",
		regex: /ss/,
		resolve: function(data, dataArr) {
			console.log("gt02a: keep-alive: is: ", dataArr);
			return dataArr.toString();
		}
	}
];


