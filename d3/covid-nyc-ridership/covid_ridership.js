// js for Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9lbWFybG8iLCJhIjoiY2tmazR1cnltMHBwcjJ6bWpoemxkemU2MiJ9.je3oLLKlEn3Y6dyEAIfJ-Q';
// Set bounds to New York, New York
var bounds = [
  [-74.15, 40.52], // Southwest coordinates
  [-73.68, 40.95] // Northeast coordinates
  ];

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/joemarlo/ckfk4xv1o2uk419o09qcf9an7',
  center: [-73.975, 40.7],
  zoom: 10,
  maxZoom: 12,
  pitch: 40,
  maxBounds: bounds // Sets bounds as max
  });

  map.addControl(new mapboxgl.FullscreenControl());
