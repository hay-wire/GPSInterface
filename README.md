GPS INTERFACE
##############

Simple TCP server to support gps devices through a plug and play system. It can be used as an interface between your app server and GPS devices.

Plug and Play Styled
--------------------

Any new device to be added needs to conform to the interface described in device/gt02a and it will be available for use whenever a new request comes in for that type of device after the server is restarted.

Description
-----------

The server currently recognizes only GT02a GPS hardware, (the piece I got had a rather bad implementation of tk02 protocol!) and understands 2 messages, "Handshake" and "current location".

To run the server, you can type in "npm start" and it would start listening on port 7018. In order to simulate a gps device, you can use telnet and connect on port 7018. You can then send:

	Handshake:
		(027042573071BP00000027042573071HSO)
		
	Current location:
		(027042573071BR00141206A1904.6176N07250.8073E002.50952072.730000000000L00000000)

as described in devices/gt02a.js file (please check this file to understand how you can play around with message contents).

The system is plugin styled. If you wish to add a new device with similar functionalities, you can just write another driver file similar to gt02a.js file.

Each driver file is expected to export atleast 2 functions: "deviceType" and "availableFxns"

	1. deviceType is a string and must be same as the file name (as with class files in Java)
	2. availableFxns is a JSON array of objects. Each object is at least expected to have a "name", a "regex" to match to the string (sent by its corresponding GPS device) it wishes to respond to, and a "resolve" method, which will be passed a "data" parameter and a "callback function" by the system. "data" parameter will contain the evaluated regex parts.

This way, if you wish to add recognition facility for gt03 protocol or any other protocol which is based on TCP, you just need to add a driver file gt03.js in devices/ directory and restart the server and It would be consumed automatically.

Let me know if anything is not working as expected. 
In case you need some help, feel free to write me at <prashantdwivedi06@gmail.com>
or shoot me a tweet on: https://twitter.com/_ioctl
