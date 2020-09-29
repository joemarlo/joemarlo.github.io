// create dollar formatter
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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

// only add fullscreen if not on Safari (Safari has issues with CSS)
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

if (!isSafari){
  map.addControl(new mapboxgl.FullscreenControl());
}

map.on('load', function() {

    // for features box
    map.on('mousemove', function(e) {
      var PUMA = map.queryRenderedFeatures(e.point, {
        layers: ['nyc-puma-90k9up']
      });

      if (PUMA.length > 0) {
        document.getElementById('pd').innerHTML = '<h5><strong>PUMA: ' + PUMA[0].properties.puma + '</strong></h5><p><strong>' +
          PUMA[0].properties.ridership_change.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0}) + ' change in ridership<br>' +
          formatter.format(PUMA[0].properties.mean_income) + ' mean household income<br>' +
          PUMA[0].properties.Mean_essential.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0}) + ' of workers deemed essential</p>';
      } else {
        document.getElementById('pd').innerHTML = '<p>Hover over an area to get attributes</p>';
      }

    });

    /*
    // for tooltip box
    map.on('mouseenter', function(e) {
    var station = map.queryRenderedFeatures(e.point, {
      layers: ['subway-ridership']
    });
    station[0].properties.ridership_change.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:0})
    */

    map.getCanvas().style.cursor = 'default';

  });
