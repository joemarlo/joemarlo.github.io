function getConfigBar(){
  let width = 250;
  let height = 200;
  let margin = {
      top: 10,
      bottom: 70,
      left: 10,
      right: 20
  }

  //The body is the area that will be occupied by the bars.
  let bodyHeight = height - margin.top - margin.bottom;
  let bodyWidth = width - margin.left - margin.right;

  //The container is the SVG where we will draw the chart
  let container = d3.select("#plot_histograms" );

  return {width, height, margin, bodyHeight, bodyWidth, container}
}

function getScalesBar(data, configBar, id) {
 let { bodyWidth, bodyHeight } = configBar;
 let maximumValue = d3.max(data, d => +d.value);

 // set domain (i.e. x axis labels)
 xDomain = data.map(function(d) { return d.key; }).sort()

 // manually set domains for some
 if (id == 'education'){xDomain = ['No HS', 'HS', 'Some college', 'Bachelors', 'Masters', 'Doctoral', 'Unknown']}
 if (id == 'n_child'){xDomain = ['0', '1', '2', '3', '4', '5', '6']}

 let xScale = d3.scaleBand()
     .domain(xDomain)
     .range([0, bodyWidth])
     .padding(0.2);

 let yScale = d3.scaleLinear()
     .domain([0, maximumValue*1.4]) //this is a hack b/c I can't figure out why margins aren't working
     .range([bodyHeight, 0])

 return {xScale, yScale}
}

function drawBars(data, configBar, scales, id, title){
  let {margin, container, bodyHeight, bodyWidth, width, height} = configBar;
  let {xScale, yScale} = scales
  console.log('Data inputted to drawBars():', data)

  // add svg to the container
  container = container
   .append("svg")
   .attr("class", "plotBar" + id)
   .attr("width", width)
   .attr("height", height)

  // remove and redraw X axis
  d3.selectAll(".bottomAxisBar" + id).remove()
  container.append("g")
   .attr("class", "bottomAxisBar bottomAxisBar" + id)
   .attr("transform", "translate(0," + bodyHeight + ")")
  // .attr("transform", "translate(" + margin.left + "," + bodyHeight + ")")
   .call(d3.axisBottom(xScale))
   .selectAll("text")
     .attr("transform", "translate(5,5)rotate(50)")
     .style("text-anchor", "start");

  // remove and redraw x axis label
  /*
  d3.selectAll(".xaxis_label_bar_"+id).remove()
  container.append("text")
    .attr("class", "xaxis_label xaxis_label_bar_"+id)
    .attr("transform",
          "translate(" + (bodyWidth*1/2) + " ," + (bodyHeight + (margin.bottom*3/4)) + ")")
    .text(id)
  */

 // join data with rect
 let rects = container
   .selectAll("rectBar" + id)
   .data(data)

 // add the new bars
 rects
   .enter()
   .append("rect")
   .merge(rects)
     .attr("x", d => xScale(d.key))
     .attr("y", d => yScale(d.value))
     .attr("width", xScale.bandwidth())
     .attr("height", d => bodyHeight - yScale(d.value))
     .attr("class", "rectBar" + id)
     .on("mouseover", function(d){
       d3.select(this).transition()
         .duration('50')
         .attr('opacity', '0.8');
     })
     .on("mouseleave", function(d){
       d3.select(this).transition()
         .duration('50')
         .attr('opacity', '1')
     })
     .transition()
       .duration(750)
       .styleTween("fill", d => d3.interpolate("white", "#394E48"))

 // delete the old bars
 rects
   .exit()
   .remove()

 // Add title to graph
 d3.select("svg.plotBar"+id)
   .append("text")
     .attr("class", "plot_title_bar_plot plot_title_bar_plot_text")
     .attr("x", 0) //margin.left
     .attr("y", (margin.top * 1.3))
     .text(title);
}

function drawBarPlots(data) {
  filteredData = data
  // delete old plots
  d3.select("svg.plotBarsex").remove()
  d3.select("svg.plotBarmarried").remove()
  d3.select("svg.plotBareducation").remove()
  d3.select("svg.plotBarrace").remove()
  d3.select("svg.plotBarn_child").remove()

  // get config, scales then draw the plots
  let configBar = getConfigBar();

  let counts = countData(filteredData, 'sex')
  let scales = getScalesBar(counts, configBar, 'sex');
  drawBars(data=counts, configBar=configBar, scales=scales, id='sex', title='Sex');

  counts = countData(filteredData, 'married')
  scales = getScalesBar(counts, configBar, 'married');
  drawBars(data=counts, configBar=configBar, scales=scales, id='married', title='Married');

  counts = countData(filteredData, 'education')
  scales = getScalesBar(counts, configBar, 'education');
  drawBars(data=counts, configBar=configBar, scales=scales, id='education', title='Education');

  counts = countData(filteredData, 'n_child')
  scales = getScalesBar(counts, configBar, 'n_child');
  drawBars(data=counts, configBar=configBar, scales=scales, id='n_child', title='# children in household');
}
