# Visualizing Data with Leaflet
<img src="https://github.com/NickP20/leaflet-challenge/blob/main/Images/1-Logo.png">

## Deployment Link
[Explore The Earthquake Map](https://github.com/NickP20/leaflet-challenge/blob/main/Leaflet-Step-2/index.html)

## Project Purpose
I utilized leaflet, Javascript and D3 to visualize the earthquake data from the United States Geological Survey (USGS). The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

## Level-1: Basic Visualization
### Get the Data Set
- The USGS provides earthquake data in a number of different formats, updated every 5 minutes
- The "All Earthquakes from the Past 7 Days" data set was selected from the [USGS GeoJSON Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page
- The data was given in JSON format which was used to extract the data
### Import and Visualize the Data
Create a map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude.
- The data markers reflect the magnitude of the earthquake by their size and and depth of the earth quake by color
- Data markers reflect the magnitude of the earthquake by their size and and depth of the earth quake by color
- Popups provide additional information about the earthquake when a marker is clicked
- A legend was created to provide context for the map data
<p align="center">
  <img src="https://github.com/NickP20/leaflet-challenge/blob/main/Images/step1_map.PNG">
</p>

## Level-2: More Data
Plot a second data set on the map to illustrate the relationship between tectonic plates and seismic activity.
- Data on tectonic plates [Tectonic Plates](https://github.com/fraxen/tectonicplates)
- Plot a second data set
- Add a number of base maps to choose from (Satellite Map, Grayscale Map, and Outdoors Map)
- Separate out the two different data sets (earthquakes and tectonic plates) into overlays that can be turned on and off independently
- Add layer controls to the map
<p align="center">
  <img src="https://github.com/NickP20/leaflet-challenge/blob/main/Images/step2_map.PNG">
</p>
