// 

var t,
    map,
    my_lat = geoip_latitude(),
    my_lng = geoip_longitude(),
    my_id = guid(),
    markers = {},
    current = [],
    me = {id: my_id, lat: my_lat, lng: my_lng};

log('My ID: '+my_id);

$(function() {
  $('#mapbox').height(window.innerHeight);

  init('mapbox', 'http://a.tiles.mapbox.com/v3/joshellington.map-906jvud1.jsonp');
});

// Map stuff

function init(cont, url) {
  map = new L.Map('mapbox').setView(new L.LatLng(my_lat, my_lng), 15);

  wax.tilejson(url, function(tilejson) {
      map.addLayer(new wax.leaf.connector(tilejson));
  });
}

// Pubnubber

PUBNUB.subscribe({
  channel: id,
  restore: false,
  callback: function(msg) {
    log('message received');
    log(msg);
    log('////////');

    log('current ids');
    log(current);
    log('////////');
    
    if ( msg.status == 'connected' && current.indexOf(msg.id) == -1 ) {
      add(msg);
    } else if ( msg.status == 'disconnected' ) {
      remove(msg);
    }
  },
  connect: function() {
    me.status = 'connected';
    publish(me);
    
    t = setInterval(function() {
      me.status = 'connected';
      publish(me);  
    }, 500);
  },
  disconnect: function() {
    clearInterval(t);

    me.status = 'disconnected';
    publish(me);
  }
});

function publish(obj) {
  PUBNUB.publish({
    channel: id,
    message: obj
  });
}

function remove(obj) {
  // Remove marker
  log('Removed marker!!');
  log(markers.obj.id);
  map.removeLayer(markers.obj.id);
  var idx = current.indexOf(obj.id);
  current.splice(idx, 1);
}

function add(obj) {
  log('Marker added!!');

  // Add marker
  var loc = new L.LatLng(obj.lat, obj.lng);

  var Icon = L.Icon.extend({
    iconUrl: '/img/icons/marker-solid-24.png',
    shadowUrl: null,
    iconSize: new L.Point(24, 24),
    shadowSize: null,
    iconAnchor: new L.Point(12, 24),
    popupAnchor: new L.Point(0,-24)
  });

  var marker = new L.Marker(loc, {
    icon: new Icon()
  });

  markers.my_id = marker;
  current.push(obj.id);

  map.addLayer(marker);
}