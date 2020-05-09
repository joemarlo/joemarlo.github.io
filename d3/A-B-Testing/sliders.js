//script for slider text

var slider1 = document.getElementById("slider_effectsize");
var output1 = document.getElementById("value_effectsize");
output1.innerHTML = slider1.value;

var slider2 = document.getElementById("slider_samplesize");
var output2 = document.getElementById("value_samplesize");
output2.innerHTML = slider2.value;

var slider3 = document.getElementById("slider_stops");
var output3 = document.getElementById("value_stops");
output3.innerHTML = slider3.value;

var slider4 = document.getElementById("slider_comparisons");
var output4 = document.getElementById("value_comparisons");
output4.innerHTML = slider4.value;

slider1.oninput = function() {
  output1.innerHTML = this.value;
};
slider2.oninput = function() {
  output2.innerHTML = this.value;
};
slider3.oninput = function() {
  output3.innerHTML = this.value;
};
slider4.oninput = function() {
  output4.innerHTML = this.value;
};
