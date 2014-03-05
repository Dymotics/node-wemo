var wemoController = require("../lib/wemoControler.js");


var testWemoControler = function(uuid){

	setTimeout( function(){wemoController.switchOn(uuid);},	1000 );	
	setTimeout( function(){wemoController.switchOff(uuid);} , 3000 );
	setTimeout( function(){wemoController.switchOn(uuid);} , 5000 );
	setTimeout( function(){wemoController.switchOff(uuid);} , 7000 );


	wemoController.onDeviceStatusChange(uuid, function(deviceId, status){
		console.log('Status changed for device ' + deviceId + JSON.stringify(status))
	});

}


wemoController.onNewDevice(testWemoControler);