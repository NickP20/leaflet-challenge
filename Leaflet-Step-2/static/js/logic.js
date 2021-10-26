// plate layer
var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var plateLayer;
var plateStyle = {
  color:"darkgoldenrod",
  fillOpacity:0,
  weight: 1.5
};
d3.json(plateUrl).then(function(data){
  plateLayer = L.geoJSON(data,{
      style:plateStyle
  });
});

//define a function to get color of earthquake depth
function getColor(d) {
  switch (true) {
    case d > 90:
      return "red";
    case d > 70:
      return "tomato";
    case d > 50:
      return "orange";
    case d > 30:
      return "yellow";
    case d > 10:
      return "yellowgreen";
    default:
      return "green";
    }
  }

// Store our API endpoint as queryUrl
var earthQuakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
// markerLayer with the data
d3.json(earthQuakeUrl).then(function(data) {
  features = data.features;
  var earthquakeData =[];
  var earthquakeMarker = [];
  features.forEach(
      function(f){
          var e = {};
          e.place = f.properties.place;
          e.mag = f.properties.mag;
          e.location = [f.geometry.coordinates[1],f.geometry.coordinates[0]];
          e.depth = f.geometry.coordinates[2];
          earthquakeData.push(e);
      }      
  );
  earthquakeData.forEach(
      function(earthQuake){
        earthquakeMarker.push(L.circleMarker(earthQuake.location,{
          fillOpacity:0.9,
          color:getColor(earthQuake.depth),
          radius: earthQuake.mag*5,
          fillColor: getColor(earthQuake.depth)
        }).bindPopup(`<h2>${earthQuake.place}</h2><hr><h3>Mag: ${earthQuake.mag}</h3><hr><h4>Depth: ${earthQuake.depth}</h4><hr><h4>latitude/longitude: ${earthQuake.location}<h/4>`));  
      });   
  var earthQuakeLayer = L.layerGroup(earthquakeMarker); 

  //overlay maps
  var overlayMaps = {
      "Tectonic Plates": plateLayer,  
      "Earthquakes": earthQuakeLayer
  };

  // Define map layers
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY
  });

  var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "outdoors-v11",
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

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
      "Satellite Map": satellitemap,
      "Grayscale Map": grayscaleMap,
      "Outdoors Map": outdoorsmap
  };

  // Create a new map
  var myMap = L.map("map", {
      center: [37.0902, -95.7129],
      zoom: 3,
      layers: [satellitemap, earthQuakeLayer]
  }); 
  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);
  
  // Add legend
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90];
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      };
      return div;
  };
  legend.addTo(myMap);
}); 