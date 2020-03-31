
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    

// append the svg object to the body of the page
var svg = d3.select("div#scatter_area")
   .append("div")
   // Container class to make it responsive.
   .classed("svg-container", true) 
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 700 400")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");



//Read the data
d3.csv("/d3/covid-impact/data/daily_subway.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value, text : d.text }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .styles({
          fill:"none",
          stroke:"#bdbdbd",
          "stroke-width":"0.5"
        })
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, 6])
      .range([ height, 0 ]);
    svg.append("g")
      .styles({
          fill:"none",
          stroke:"#bdbdbd",
          "stroke-width":"0.5"
        })
      .call(d3.axisLeft(y));
      
    // text label for the y axis
     svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("stroke-width", 0.7)
      .attr("stroke", "#bdbdbd")
      .text("Daily ridership in millions");

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2b7551")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

    // create a tooltip
    var Tooltip = d3.select("div#tooltip")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("color", "black")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "0px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        Tooltip
          .html(d.text + " ridership: " + Math.round(d.value * 100, 2) / 100 + " million")
          .style("left", (d3.mouse(this)[0] + 70) + "px")
          .style("top", (d3.mouse(this)[1] + 10) + "px")
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
      }
      
    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 4)
        .attr("stroke", "#2b7551")
        .attr("stroke-width", 2)
        .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

}
)
 
   
   