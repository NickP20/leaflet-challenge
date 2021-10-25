// URL
var quakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
//Tectonic Plate URL
var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// layerGroups
var quakesLayer = L.layerGroup();
var plateLayer = L.layerGroup();

// Creating Map Layers
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

var grayscaleMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

//Create BaseMap for base layers
var baseMaps = {
  "satellite Map": satelliteMap,
  "Grayscale Map": grayscaleMap,
  "Outdoors Map": outdoorsMap
};
//overlay maps
var overlayMaps = {
  "Tectonic Plates": plateLayer,
  "Earthquakes": quakesLayer
};

//create map with default satellite and quake layers
var myMap = L.map("map", {
  center: [
    37.0902, -95.7129
  ],
  zoom: 2,
  layers: [satelliteMap, quakesLayer]
});

// Layer Control
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

d3.json(quakesUrl, function (earthquakeData) {
  //Set maker size to magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  };
  // Function that will determine the color based on depth
  function chooseColor(depth) {
    console.log(depth)
    switch (true) {
      case depth > 90:
        return "red";
      case depth > 70:
        return "tomato";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "yellow";
      case depth > 10:
        return "yellowgreen";
      default:
        return "green";
    }
  }

  //GeoJson Layer maker layer
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng,
        //styling of marker
        {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.8,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: " + new Date(feature.properties.time)
        + "</p><hr><p>Magnitude: " + feature.properties.mag + "</P>");
    }
  }).addTo(quakesLayer);
  //adding quakesLayer to createMap function
  quakesLayer.addTo(myMap);

  //Tectonic plate data
  d3.json(plateUrl, function (data) {
    L.geoJSON(data, {
      color: "darkgoldenrod",
      fillOpacity: 0,
      weight: 2
    }).addTo(plateLayer);
    plateLayer.addTo(myMap);
  });

  //Legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += "h3 style='text-align: center'>Depth</h3>"

    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background: ' + chooseColor(depth[i] + 1) + '"><i/> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + dpeth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
});