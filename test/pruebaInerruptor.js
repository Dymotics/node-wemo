var wemoController = require("../lib/wemoControler.js");


var testAPI = function(uuid){
//	wemoController.onDeviceStatusChange(deviceStatusChanged)

	setTimeout( function(){wemoController.switchOn(uuid);},	1000 );	
	setTimeout( function(){wemoController.switchOff(uuid);} , 3000 );
	setTimeout( function(){wemoController.switchOn(uuid);} , 5000 );
	setTimeout( function(){wemoController.switchOn(uuid);} , 7000 );


	wemoController.onDeviceStatusChange(uuid, function(deviceId, status){
		console.log('Status changed for device ' + deviceId + JSON.stringify(status))
	});


}


wemoController.onNewDevice(testAPI);



/*
var deviceStatusChanged = function(deviceId, status){
	notifyDymoticsCallbackStatusChanged(deviceId, status)
}

*/