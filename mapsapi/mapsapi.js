var map;

var styles = [
  {
    featureType: "poi",
    stylers: [{visibility: "off"}]
  },
  {
    featureType: "transit",
    stylers: [{visibility: "off"}]
  }
];

const URL = "https://covid-19-challenge-272517.firebaseio.com/coordinates.json";
var request = new XMLHttpRequest();

request.open("GET", URL);

function initMap() {
  const CENTER_OF_US = new google.maps.LatLng(34.054, -84.148);

  map = new google.maps.Map(document.getElementById("map"), {
    center: CENTER_OF_US,
    zoom: 16,
    styles: styles,
    disableDoubleClickZoom: true,
    streetViewControl: false
  });
}

request.onload = function() {
  var markers = [];
  var db = JSON.parse(request.response);
  for (var key in db) {
    marker = {
      position: new google.maps.LatLng(db[key]["lat"], db[key]["lng"]),
      map: map,
      content: 'Age: ' + db[ key ][ 'ageGroup' ] + ' years\n' + db[ key ][ 'ageGroup' ]
    };
    markers.push(marker);
  }

  addMarkersToMap(markers);
};

request.send();

function addMarkersToMap(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i] = new google.maps.Circle({
      position: markers[i].position,
      center: markers[i].position,
      radius: 20,
      strokeWeight: 0,
      fillColor: '#f00',
      fillOpacity: 0.7,
      map: markers[i].map,
      content: markers[i]
    });
  }
}
