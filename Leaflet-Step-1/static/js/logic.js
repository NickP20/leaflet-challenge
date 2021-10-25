// Creating map object
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 4
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // URL
  var quakesUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

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

 function getstyle(feature){
   return {
    radius:5*feature.properties.mag, fillColor: chooseColor(feature.geometry.coordinates[2]),
    fillOpacity: .9, weight: .5, color: "black"
   }
 }

 // Perform a GET request to the query URL
d3.json(quakesUrl).then(function(data) {
  console.log(data.features);
  // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
  L.geoJSON(data.features,
    {
      onEachFeature: function(feature, marker) {
        marker.bindPopup(
          `<h2>${feature.properties.place}</h2><hr><h4>Depth: ${feature.geometry.coordinates[2]}</h4><hr>Magnitude: ${feature.properties.mag}`
        );
      },
      pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng)
      },
      style: getstyle
    }
  ).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["-10-10","10-30","30-50","50-70","70-90","90+"];
    var colors = ["green","yellowgreen","yellow","orange","tomato","red"];
    var labels = [];

    limits.forEach(function(limit, index) {
      labels.push("<div><i style=\"background-color: " + colors[index] + "\"></i><span>"+limits[index]+"</span></div>");
    });

    div.innerHTML += labels.join("");
    return div;
  };
  // Adding legend to the map
  legend.addTo(myMap);

});