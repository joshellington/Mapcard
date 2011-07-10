/* Author: 

*/

var map;

$(function() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error);
		subscribe();
	} else {
		error('not supported');
	}

});

function subscribe() {
	// listen for messages
	PUBNUB.subscribe({
	    channel  : "<%= @key %>",
	    callback : function(message) {
	    	// log(message);
		    addmarker(message.lat, message.lng);
		}
	});
}

function publish(position) {
	// send message
	PUBNUB.publish({
	    channel : "<%= @key %>",
	    message : {'lat': position.coords.latitude, 'lng': position.coords.longitude}
	});
}

function success(position) {
	
	// log(position);
	setmap('map', position);

}

function error(msg) {
	log(msg);
}

function addmarker(lat, lng) {

	var LeafIcon = L.Icon.extend({
		iconUrl: '/img/marker.png',
		shadowUrl: '/img/marker-shadow.png',
	});

	var blueIcon = new LeafIcon();

	var markerLocation = new L.LatLng(lat, lng),
		marker = new L.Marker(markerLocation, {icon: blueIcon});
	
	map.addLayer(marker);
	marker.bindPopup("Friend").openPopup();
}

function setmap(id, position) {

	log(position.coords);

	publish(position);

	// Set full width/height
	$('#'+id).width(document.width).height(document.height);

	// initialize the map on the "map" div with a given center and zoom 
	map = new L.Map(id, {
	    center: new L.LatLng(position.coords.latitude, position.coords.longitude),
	    zoom: 5
	});

	// create a CloudMade tile layer
	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/401429e8338a4533aae6e555748c7d74/997/256/{z}/{x}/{y}.png',
	    cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 16});

	var LeafIcon = L.Icon.extend({
		iconUrl: '/img/marker.png',
		shadowUrl: '/img/marker-shadow.png',
	});

	var blueIcon = new LeafIcon();

	var markerLocation = new L.LatLng(position.coords.latitude, position.coords.longitude),
		marker = new L.Marker(markerLocation, {icon: blueIcon});

	map.addLayer(marker);
	marker.bindPopup("You are here!").openPopup();

	// add the CloudMade layer to the map
	map.addLayer(cloudmade);

	// map.on('click', onMapClick);
		
	var popup = new L.Popup();
			
	function onMapClick(e) {
		var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';
		
		popup.setLatLng(e.latlng);
		popup.setContent("You clicked the map at " + latlngStr);
		map.openPopup(popup);
	}

}