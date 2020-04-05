
// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
    

// append the svg object to the body of the page
var svg_S = d3.select("div#subway_citibike")
   .append("div")
   // Container class to make it responsive.
   .classed("svg-container", true) 
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 700 300")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
  .append("svg")
   .attr("width", width + margin.left + margin.right)
   .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// append the svg object to the body of the page
var svg_C = d3.select("div#subway_citibike")
   .append("div")
   // Container class to make it responsive.
   .classed("svg-container", true) 
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 700 300")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


// append the svg object to the body of the page
var svg_unemp = d3.select("div#unemp")
   .append("div")
   // Container class to make it responsive.
   .classed("svg-container", true) 
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 700 300")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");




//Read the subway and citibike data
d3.csv("/d3/covid-impact/data/subway_citibike.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value, text : d.text, bike_count : d.bike_count }
  },

  // Now I can use this dataset:
  function(data) {

  // subway plot
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg_S.append("g")
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
    svg_S.append("g")
      .styles({
          fill:"none",
          stroke:"#bdbdbd",
          "stroke-width":"0.5"
        })
      .call(d3.axisLeft(y));
      
    // text label for the y axis
     svg_S.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("stroke-width", 0.7)
      .attr("stroke", "#bdbdbd")
      .text("Subway ridership in millions");
      
      
    // Add the line
    svg_S.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2b7551")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

    // create a tooltip
    var Tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("color", "#333333")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "0px")
      .style("padding", "5px")

      
    // Add the points
    svg_S
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("class", function(d, i) {return "pt" + i;})
        .attr("r", 4)
        .attr("stroke", "#2b7551")
        .attr("stroke-width", 2)
        .attr("fill", "white")
        // Three function that change the tooltip when user hover / move / leave a cell
        .on('mouseover', function(d, i) {
            console.log("mouseover on", this);
            // make the mouseover'd element big
            d3.selectAll("circle.pt" + i)
              .transition()
              .duration(75)
              .attr('r', 8)
              .attr('fill', '#333333')
              .attr('stroke-opacity', 0);
            
            // this makes the tooltip show
            Tooltip.style("opacity", 1)
          })
          
        .on('mousemove', function(d, i) {
          // this makes the tooltip move
          Tooltip
            .html("<b>" + d.text + "</b><br>" + 
                  "- " + Math.round(d.value * 10, 2) / 10 + " million subway rides <br>" + 
                  "- " + Math.round(d.bike_count * 10, 2) / 10 + " thousand Citibike rides")
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY + "px")
        })
        
        .on('mouseout', function(d, i) {
            console.log("mouseout", this);
            // return the mouseover'd element to the original format
            d3.selectAll("circle.pt" + i)
              .transition()
              .duration(200)
              .attr('r', 4)
              .attr('fill', 'white')
              .attr('stroke-opacity', 1);
              
              // this makes the tooltip disappear
              Tooltip.style("opacity", 0)
          })





  // citibike plot
  
    // Add X axis --> it is a date format
    svg_C.append("g")
      .styles({
          fill:"none",
          stroke:"#bdbdbd",
          "stroke-width":"0.5"
        })
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    
    // Add Y axis
    var y_C = d3.scaleLinear()
      .domain( [0, 100])
      .range([ height, 0 ]);
    svg_C.append("g")
      .styles({
          fill:"none",
          stroke:"#bdbdbd",
          "stroke-width":"0.5"
        })
      .call(d3.axisLeft(y_C));
      
    // text label for the y axis
     svg_C.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("stroke-width", 0.7)
      .attr("stroke", "#bdbdbd")
      .text("Citibike ridership in thousands");
    
    // Add the line
    svg_C.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3262a8")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y_C(d.bike_count) })
        )


    // Add the points
    svg_C
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y_C(d.bike_count) } )
        .attr("class", function(d, i) {return "pt" + i;})
        //make radius 0 if bike count is NA, otherwise make it 4
        .attr("r", function(d) { return d.bike_count == "NA" ? 0 : 4; })
        .attr("stroke", "#3262a8")
        .attr("stroke-width", 2)
        .attr("fill", "white")
        
        // Three function that change the tooltip when user hover / move / leave a cell
        .on('mouseover', function(d, i) {
            console.log("mouseover on", this);
            // make the mouseover'd element big
            d3.selectAll("circle.pt" + i)
              .transition()
              .duration(75)
              .attr('r', 8)
              .attr('fill', '#333333')
              .attr('stroke-opacity', 0);
            
            // this makes the tooltip show
            Tooltip.style("opacity", 1)
          })
          
        .on('mousemove', function(d, i) {
          // this makes the tooltip move
          Tooltip
            .html("<b>" + d.text + "</b><br>" + 
                  "- " + Math.round(d.value * 10, 2) / 10 + " million subway rides <br>" + 
                  "- " + Math.round(d.bike_count * 10, 2) / 10 + " thousand Citibike rides")
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY + "px")
        })
        
        .on('mouseout', function(d, i) {
            console.log("mouseout", this);
            // return the mouseover'd element to the original format
            d3.selectAll("circle.pt" + i)
              .transition()
              .duration(200)
              .attr('r', 4)
              .attr('fill', 'white')
              .attr('stroke-opacity', 1);
              
              // this makes the tooltip disappear
              Tooltip.style("opacity", 0)
          })
        
}
)









//Read the subway and citibike data
d3.csv("/d3/covid-impact/data/unemp.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { DATE : d3.timeParse("%Y-%m-%d")(d.DATE), ICSA : d.ICSA, unemp_text : d.text }
  },

  // Now I can use this dataset:
  function(data) {

  // unemployment plot
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.DATE; }))
      .range([ 0, width ]);
    svg_unemp.append("g")
      .styles({
          fill:"none",
          stroke:"#bdbdbd",
          "stroke-width":"0.5"
        })
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0, 80])
      .range([ height, 0 ]);
    svg_unemp.append("g")
      .styles({
          fill:"none",
          stroke:"#bdbdbd",
          "stroke-width":"0.5"
        })
      .call(d3.axisLeft(y));
      
    // text label for the y axis
     svg_unemp.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("stroke-width", 0.7)
      .attr("stroke", "#bdbdbd")
      .text("Initial weekly unemployment claims (thousands)");
      
      
    // Add the line
    svg_unemp.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2b7551")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.DATE) })
        .y(function(d) { return y(d.ICSA) })
        )

    // create a tooltip
    var Tooltip = d3.select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("color", "#333333")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "0px")
      .style("padding", "5px")

      
    // Add the points
    svg_unemp
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.date) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("class", function(d, i) {return "pt" + i;})
        //make radius 0 if value is NA, otheriwse make it 4
        .attr("r", function(d) { return d.value == "NA" ? 0 : 4; })
        .attr("stroke", "#2b7551")
        .attr("stroke-width", 2)
        .attr("fill", "white")
        // Three function that change the tooltip when user hover / move / leave a cell
        .on('mouseover', function(d, i) {
            console.log("mouseover on", this);
            // make the mouseover'd element big
            d3.selectAll("circle.pt" + i)
              .transition()
              .duration(75)
              .attr('r', 8)
              .attr('fill', '#333333')
              .attr('stroke-opacity', 0);
            
            // this makes the tooltip show
            Tooltip.style("opacity", 1)
          })
          
        .on('mousemove', function(d, i) {
          // this makes the tooltip move
          Tooltip
            .html("<b>" + d.unemp_text + "</b><br>" + 
                  "- " + Math.round(d.value * 10, 2) / 10 + " million subway rides <br>" + 
                  "- " + Math.round(d.bike_count * 10, 2) / 10 + " thousand Citibike rides <br>" +
                  "- " + Math.round(d.ICSA * 10, 2) / 10 + " million initial weekly claims")
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY + "px")
        })
        
        .on('mouseout', function(d, i) {
            console.log("mouseout", this);
            // return the mouseover'd element to the original format
            d3.selectAll("circle.pt" + i)
              .transition()
              .duration(200)
              .attr('r', 4)
              .attr('fill', 'white')
              .attr('stroke-opacity', 1);
              
              // this makes the tooltip disappear
              Tooltip.style("opacity", 0)
          })

}
)




