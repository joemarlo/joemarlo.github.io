function getConfigHist() {
   let width = 250;
   let height = 200;
   let margin = {
       top: 10,
       bottom: 70,
       left: 10,
       right: 10
   }

   //The body is the area that will be occupied by the bars.
   let bodyHeight = height - margin.top - margin.bottom;
   let bodyWidth = width - margin.left - margin.right;

   //The container is the SVG where we will draw the chart
   let container = d3.select("#plot_histograms" );

   return {width, height, margin, bodyHeight, bodyWidth, container}
}

function getScalesHist(data, configHist, id) {
 let { bodyWidth, bodyHeight } = configHist;
 let maximumValue = d3.max(data, d => +d[id]);
 let minimumValue = d3.min(data, d => +d[id]);
 //console.log(d3.max(data, d => +d[id]))

 let xScale = d3.scaleLinear()
     .domain([minimumValue, maximumValue]) //[minimumValue, maximumValue]
     .range([0, bodyWidth])
 let yScale = d3.scaleLinear()
     .range([bodyHeight, 0])

 return {xScale, yScale}
}

function drawHistBars(data, nbins, scales, configHist, id, axisLabel){
  let {margin, container, bodyHeight, bodyWidth, width, height} = configHist;
  let {xScale, yScale} = scales


  // add svg to the container
  container = container
   .append("svg")
   .attr("class", "plotHist" + id)
   .attr("width", width)
   .attr("height", height)

  console.log('Data inputted to drawHistBars():', data)

  // set the parameters for the histogram
  let histogram = d3.histogram()
        .value(d => +d[id])
        .domain(xScale.domain())
        //.thresholds(xScale.ticks(nbins));

  // get the binned data
  let bins = histogram(data);

  // remove and redraw X axis
  d3.selectAll(".bottomAxisHist" + id).remove()
  container.append("g")
    .attr("class", "bottomAxisHist bottomAxisHist" + id)
    .attr("transform", "translate(" + margin.left + "," + bodyHeight + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("transform", "translate(5,5)rotate(40)")
      .style("text-anchor", "start");

  /*// remove and redraw x axis label
  d3.selectAll(".xaxis_label_hist_"+id).remove()
  container.append("text")
      .attr("class", "xaxis_label xaxis_label_hist_"+id)
      .attr("transform",
            "translate(" + (bodyWidth*1/2) + " ," + (bodyHeight + (margin.bottom*3/4)) + ")")
      .text(axisLabel)
    */

  // remove and redraw Y axis
  yScale.domain([0, d3.max(bins, d => d.length)*1.4]); //this is a hack b/c I can't figure out why margins aren't working

  // join data with rect
  let rects = container
    .selectAll("rectHist" + id)
    .data(bins)

  // add the new bars
  rects
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(rects) // get the already existing elements as well
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + (xScale(d.x0) + margin.left) + "," + yScale(d.length) + ")"; })
      .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
      .attr("height", function(d) { return bodyHeight - yScale(d.length); })
      .attr("class", "rectHist" + id)
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
  d3.select("svg.plotHist"+id)
    .append("text")
      .attr("class", "plot_title_bar_plot plot_title_bar_plot_text")
      .attr("x", 0) //margin.left
      .attr("y", (margin.top * 1.3))
      .text(axisLabel);
 }

function drawHistograms(data) {
  // delete old plots
  d3.select("svg.plotHistage").remove()
  d3.select("svg.plotHistn_child").remove()
  d3.select("svg.plotHistHH_income").remove()

  // get config, scales then draw the plots
  let configHist = getConfigHist();
  let scales = getScalesHist(data, configHist, 'age');
  drawHistBars(data, 20, scales, configHist, id='age', axisLabel='Age');
  scales = getScalesHist(data, configHist, 'n_child');
  drawHistBars(data, null, scales, configHist, id='n_child', axisLabel='Number of children');
  scales = getScalesHist(data, configHist, 'HH_income');
  drawHistBars(data, null, scales, configHist, id='HH_income', axisLabel='Household income');
}
