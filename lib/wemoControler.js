var UpnpControlPoint = require("upnp-controlpoint").UpnpControlPoint;
var	wemo = require("upnp-controlpoint/lib/wemo");

var type = {'wemoSensor': 'SENSOR', 'wemoSwitch': 'SWITCH'};
var controlPoint;
var switches = {}
var sensors = {}
var newDevicesListeners = [];

var init = function(){
	controlPoint = new UpnpControlPoint();
	controlPoint.on("device", deviceDetected);
	setInterval(searchForDevice, 1000);
}

var onNewDevice = function(callback){
	
	newDevicesListeners.push(callback);
	notifyListenerOfCurrentlyAddedDevices(callback);

};

var notifyListenerOfCurrentlyAddedDevices = function(callback) {
	var switchKeys = Object.keys(switches)
	var sensorKeys = Object.keys(sensors)
	
	for (var switchIndex in switchKeys) {
		var switchId = switchKeys[switchIndex]
		callback(switchId);
	}
	
	for (var sensorIndex in sensorKeys) {
		var sensorId = sensorKeys[sensorIndex]
		callback(sensorId);
	}
}

var addListenerToSwitch = function(deviceId, callback) {
	switches[deviceId].listeners.push(callback);
}

var searchForDevice = function(){
	controlPoint.search();	
}

var deviceDetected = function(device){
	
	switch (getDeviceType(device)) {
	
	case type.wemoSensor:
		break;
		
	case type.wemoSwitch:
		
		var wemoSwitch = new wemo.WemoControllee(device);
		switches[wemoSwitch.device.uuid] = {'device': device, 'status': undefined, 'listeners': []};
		wemoSwitch.on("BinaryState", function(value) {
			switchUpdated(device, value);
		});
		for (var key in newDevicesListeners) {
			var newDeviceListener = newDevicesListeners[key];
			newDeviceListener(wemoSwitch.uuid);
		}

	default:
		break;
	}	
}

var switchUpdated = function(wemoSwitch, status) {
	console.log("estatus: " + status);
	switches[wemoSwitch.uuid].status = status; 
	
	for(var key in switches[wemoSwitch.uuid].listeners) {
		var listener = switches[wemoSwitch.uuid].listeners[key]
		listener(wemoSwitch.uuid, status);
	}
}

var switchOn = function (wemoSwitchId){
	wemoSwitch = new wemo.WemoControllee(switches[wemoSwitchId].device);
	wemoSwitch.setBinaryState(true);
}

var switchOff = function (wemoSwitchId){
	wemoSwitch = new wemo.WemoControllee(switches[wemoSwitchId].device);
	wemoSwitch.setBinaryState(false);
}

var getDeviceType = function (device){	
	switch(device.deviceType) {

	case wemo.WemoControllee.deviceType:
		return type.wemoSwitch;

	case wemo.WemoSensor.deviceType:
		return type.semoSensor;
		//break;
	}
}

var onDeviceStatusChange = function(deviceId, callback){
	if (typeof callback != 'function') return;
	if (typeof switches[deviceId] == 'undefined') return;
	
	switches[deviceId].listeners.push(callback);
}

init();

exports.switchOff = switchOff;
exports.switchOn = switchOn;
exports.onNewDevice = onNewDevice;
exports.onDeviceStatusChange = onDeviceStatusChange;
exports.type = type;
