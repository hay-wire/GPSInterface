/**
 * Created by haywire on 12/6/14.
 */

/*	DATA Format:
		LatLongs:
			(027042573071BR00141206A1904.6176N07250.8073E002.50952072.730000000000L00000000)

		Keep Alive:

 */


exports.deviceType = "gt02a";	// must be same as file name

exports.availableFxns = [
	{	usage: "lat-longs",
		regex: /ss/,
		resolve:  function(dataArr) {
			console.log("gt02a: lat-longs : array is: ", dataArr);
			return dataArr;
		}
	},
	{	usage: "keep-alive",
		regex: /ss/,
		resolve: function() {
			console.log("data array is: ", dataArr);
			return dataArr;
		}
	}
];


