
// set the dimensions and margins of the graph
var margin = {top: 10, right: 50, bottom: 80, left: 75},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// append the svg object
var svg = d3.select("div#main_plot")
  .append("div")
  // Container class to make it responsive.
  .classed("svg-container", true) 
  .append("svg")
  // Responsive SVG needs these 2 attributes and no width and height attr.
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 350")
  // Class to make it responsive.
  .classed("svg-content-responsive", true)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// set starting values
default_effect_size = 0.05;
default_sample_size = 1000;
default_stops = 1;
default_comparisons = 1;

// define the x Axis
var x = d3.scaleLinear()
  .domain([0, 100])
  .range([0, width]);

// define the y Axis
var y = d3.scaleLinear()
  .range([height, 0])
  .domain([0, 0.05]);

// set the number of and y ticks and gridlines
var my_nXticks = 10;
var my_nYticks = 5;

// set the padding around the ticks
var my_tickPadsize = 5;

// set the size of the tick; also controls the grid 'overflow'
var my_tickSize = 15;

// gridlines in x axis function
function make_x_gridlines() {
      return d3.axisBottom(x)
          .ticks(my_nXticks);
}

// gridlines in y axis function
function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(my_nYticks);
}

// Define the x axis label
function drawXlabel(selection) {
  selection
    .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 40) + ")")
    .attr("text-anchor", "middle")
    .attr("fill", "#737373")
    .attr("font-size", 14)
    .text("Minutes spent on site");
}


// get the data
d3.csv("/d3/A-B-Testing/base_vector.csv", function(data) {

  // set arrays of data and offset the second array to account for the 'effect size'
  var original_data = data.map(function(d){  return d.value; });
  effect_size = default_effect_size;
  curve_offset = d3.mean(data, function(d) { return d.value}) * (effect_size);
  
  // scale the original data by the offset //and add some random noise
  var original_offset = original_data.map(x => x - (-curve_offset)); // + sign doesn't work
  //var original_offset = original_data.map(x => x - (-curve_offset * Array.from({length: 1}, d3.randomNormal(1, 0.5)))); // + sign doesn't work
  
  // slice the data down to the sample size
  var sample_size = default_sample_size;
  original_data = original_data.slice(0, sample_size);
  original_offset = original_offset.slice(0, sample_size);

  // add the X gridlines
  svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height-my_tickSize)
          .tickFormat("")
      );
      
  // add the Y gridlines
  svg.append("g")			
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width-my_tickSize)
          .tickFormat("")
      );
      
  // add the X axis
  svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .tickPadding(my_tickPadsize)
        .tickSize(my_tickSize)
        .ticks(my_nXticks));

  // Add Y axis
  svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y)
        .tickPadding(my_tickPadsize)
        .tickSize(my_tickSize)
        .ticks(my_nYticks)
        .tickFormat(""));
        
  // text label for the x and y axis
  svg.append("text").call(drawXlabel);

  // Compute kernel density estimation
  var kde = kernelDensityEstimator(kernelEpanechnikov(2), x.ticks(30));
  var density_1 = kde( original_data );
  var density_2 = kde( original_offset );

  // Plot the area
  var curve = svg
    .append('g')
    .append("path")
      .attr("class", "mypath")
      .datum(density_1)
      .attr("fill", "gray")
      .attr("opacity", "0.7")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );
      
  // Plot the second area
  var curve_2 = svg
    .append('g')
    .append("path")
      .attr("class", "mypath")
      .datum(density_2)
      .attr("fill", "#1b9e77")
      .attr("opacity", "0.7")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("d",  d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );

  // A function that update the chart when slider is moved?
  function updateChart(new_effect, new_sample) {
    
    console.log(new_effect);
    console.log(new_sample);
    
    // set arrays of data and offset the second array to account for the 'effect size'
    var original_data = data.map(function(d){  return d.value; });
    effect_size = new_effect;
    curve_offset = d3.mean(data, function(d) { return d.value}) * (effect_size);
    
    // scale the original data by the offset and add some random noise
    var original_offset = original_data.map(x => x - (-curve_offset));
   // var original_offset = original_data.map(x => x - (-curve_offset * Array.from({length: 1}, d3.randomNormal(1, 0.5)))); // + sign doesn't work
    
    // slice the data down to the sample size
    var sample_size = new_sample;
    original_data = original_data.slice(0, sample_size);
    original_offset = original_offset.slice(0, sample_size);
    
    // recompute density estimation
    kde = kernelDensityEstimator(kernelEpanechnikov(2), x.ticks(30));
    density_1 = kde( original_data );
    density_2 = kde( original_offset );

    // update the chart
    curve
      .datum(density_1)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );
      
    curve_2
      .datum(density_2)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
          .x(function(d) { return x(d[0]); })
          .y(function(d) { return y(d[1]); })
      );
  }
  
  // set starting values
  current_effect = default_effect_size;
  current_sample = default_sample_size;
  current_stops = default_stops;
  current_comparisons = default_comparisons;
  
  // Listen to the effect size slider
  d3.select("#slider_effectsize").on("change", function(d){
    current_effect = this.value;
    updateChart(current_effect, current_sample);
    console.log("Current effect size: " + current_effect);
    console.log("Current sample size: " + current_sample);
  });

  // Listen to the effect size slider
  d3.select("#slider_samplesize").on("change", function(d){
    current_sample = this.value;
    updateChart(current_effect, current_sample);
    console.log("Current effect size: " + current_effect);
    console.log("Current sample size: " + current_sample);
  });
  
  
  /*
  // Listen to the number of stops slider
  d3.select("#slider_stops").on("change", function(d){
    current_stops = this.value;
    updateChart(current_effect, current_sample, current_stops);
  });
  
  // Listen to the number of comparisons slider
  d3.select("#slider_comparisons").on("change", function(d){
    current_comparisons = this.value;
    updateChart(current_effect, current_sample, current_stops, current_comparisons);
  });
  */

});


d3.csv("/d3/A-B-Testing/prov_effect.csv", function(data) {
  //https://github.com/d3/d3-array
});


// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}





