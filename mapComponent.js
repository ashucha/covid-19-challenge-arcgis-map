// Code adapted from ARCGIS sample code for dynamically adding to layers
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Basemap",
  "esri/layers/VectorTileLayer",
  "esri/layers/FeatureLayer",
  "esri/Graphic",
  "esri/widgets/Legend"
], function(
  Map,
  MapView,
  Basemap,
  VectorTileLayer,
  FeatureLayer,
  Graphic,
  Legend
) {
  // create map using custom basemap from ArcGIS Online
  const map = new Map({
    basemap: new Basemap({
      baseLayers: [
        new VectorTileLayer({
          portalItem: { id: "474f0cb226884dd68f707ab0f2f1aa10" }
        })
      ],
      referenceLayers: [
        new VectorTileLayer({
          portalItem: { id: "1768e8369a214dfab4e2167d5c5f2454" }
        })
      ]
    })
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 3.5,
    center: [-95.7129, 37.0902] // longitude, latitude
  });

  // create empty FeatureLayer
  const casesLayer = new FeatureLayer({
    // create an instance of esri/layers/support/Field for each field object
    title: "COVID-19 Cases",
    fields: [
      {
        name: "ObjectID",
        alias: "ObjectID",
        type: "oid"
      },
      {
        name: "Name",
        alias: "Name",
        type: "string"
      },
      {
        name: "Type",
        alias: "Type",
        type: "string"
      }
    ],
    objectIdField: "ObjectID",
    geometryType: "point",
    spatialReference: { wkid: 4326 },
    source: [], // adding an empty feature collection
    renderer: {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: {
        type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
        size: 5,
        color: "Red"
      }
    },
    popupTemplate: {
      title: "{Name}"
    }
  });
  casesLayer.featureReduction = {
    type: "cluster"
  };
  map.add(casesLayer);

  // add legend
  const legend = new Legend({
    view: view
  });

  var request = new XMLHttpRequest();

  //This takes advantage of firebase's REST API
  request.open(
    "GET",
    "https://covid-19-challenge-272517.firebaseio.com/Coordinates.json"
  );

  //Once data comes in
  request.onload = function() {
    var parsed = JSON.parse(request.response);
    var graphics = [];
    var graphic;
    for (var key in parsed) {
      console.log(parsed[key]["lat"] + "," + parsed[key]["lng"]);

      graphic = new Graphic({
        geometry: {
          type: "point",
          latitude: parsed[key]["lat"],
          longitude: parsed[key]["lng"]
        },
        attributes: ""
      });
      graphics.push(graphic);
    }

    const addEdits = {
      addFeatures: graphics
    };

    applyEditsToLayer(addEdits);
  };

  request.send();
  function applyEditsToLayer(edits) {
    casesLayer
      .applyEdits(edits)
      .then(function(results) {
        if (results.addFeatureResults.length > 0) {
          var objectIds = [];
          results.addFeatureResults.forEach(function(item) {
            objectIds.push(item.objectId);
          });

          casesLayer.queryFeatures({
            objectIds: objectIds
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
});
