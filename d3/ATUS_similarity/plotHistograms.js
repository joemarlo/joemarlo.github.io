function getConfigHist() {
   let width = 300;
   let height = 200;
   let margin = {
       top: 10,
       bottom: 50,
       left: 50,
       right: 20
   }

   //The body is the area that will be occupied by the bars.
   let bodyHeight = height - margin.top - margin.bottom;
   let bodyWidth = width - margin.left - margin.right;

   //The container is the SVG where we will draw the chart
   let container = d3.select("#plot_histograms" );

   return {width, height, margin, bodyHeight, bodyWidth, container}
}

function getScalesHist(data, config, id) {
 let { bodyWidth, bodyHeight } = config;

 // if data is a number then scale it for a histogram, otherwise for a barplot
 if (Number.isFinite(+data[1][id])){
   let maximumValue = d3.max(data, d => +d[id]);
   let minimumValue = d3.min(data, d => +d[id]);
   console.log(d3.max(data, d => +d[id]))

   let xScale = d3.scaleLinear()
       .domain([minimumValue, maximumValue]) //[minimumValue, maximumValue]
       .range([0, bodyWidth])
   let yScale = d3.scaleLinear()
       .range([bodyHeight, 0])

   return {xScale, yScale}
 } else {
   // define count object that holds counts for each category
   let bins = {};

   // count the data
   data.forEach(function(d) {
       let dataToPlot = d[id];
       if(bins[dataToPlot] === undefined) {
           bins[dataToPlot] = 0;
       } else {
           bins[dataToPlot] = bins[dataToPlot] + 1;
       }
   });

   console.log(bins)
   console.log(Object.values(bins))
   vals = Object.values(bins)
   let maximumValue = Math.max.apply(null, vals)

   let xScale = d3.scaleBand()
    .domain(bins) // TODO: need to pivot data https://www.d3-graph-gallery.com/graph/barplot_basic.html
    .range([0, bodyWidth])
    .padding(0.2)

   let yScale = d3.scaleLinear()
    .domain([0, maximumValue])
    .range([bodyHeight, 0]);
 }
}

function drawBars(data, nbins, scales, config, id){
  let {margin, container, bodyHeight, bodyWidth, width, height} = config;
  let {xScale, yScale} = scales

  // add svg to the container
  container = container
   .append("svg")
   .attr("class", "plotHist" + id)
   .attr("width", width)
   .attr("height", height)

  console.log('data input to drawBars', data)

  // if the data is a number then plot a histogram, else plot barplot chart
  isfinite = Number.isFinite(+data[1][id])
  console.log("is data numeric?", isfinite)
  if (isfinite){

    // set the parameters for the histogram
    let histogram = d3.histogram()
          .value(d => +d[id])
          .domain(xScale.domain())
          .thresholds(xScale.ticks(nbins));

    // get the binned data
    let bins = histogram(data);

    // remove and redraw X axis
    d3.selectAll(".bottomAxisHist" + id).remove()
    container.append("g")
      .attr("class", "bottomAxisHist" + id)
      .attr("transform", "translate(" + margin.left + "," + bodyHeight + ")")
      .call(d3.axisBottom(xScale));

    // remove and redraw Y axis
    yScale.domain([0, d3.max(bins, d => d.length)]);

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
        .style("fill", "#394E48")
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

    // delete the old bars
    rects
      .exit()
      .remove()

  } else {

    // define count object that holds counts for each category
    let bins = {};

    // count the data
    data.forEach(function(d) {
        let dataToPlot = d[id];
        if(bins[dataToPlot] === undefined) {
            bins[dataToPlot] = 0;
        } else {
            bins[dataToPlot] = bins[dataToPlot] + 1;
        }
    });

    // join data with rect
    let rects = container
      .selectAll("rectHist" + id)
      .data(bins)

    // add the new bars
    rects
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(rects) // get the already existing elements as well
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.value))
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return bodyHeight - yScale(d.value); })
        .style("fill", "#394E48")
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

    // delete the old bars
    rects
      .exit()
      .remove()
  }
 }

function drawHistograms(data) {
  // delete old plots
  d3.select("svg.plotHistage").remove()
  d3.select("svg.plotHistn_child").remove()

  // get config, scales then draw the plots
  let config = getConfigHist();
  let scales = getScalesHist(data, config, 'age');
  drawBars(data, 20, scales, config, id='age');
  scales = getScalesHist(data, config, 'n_child');
  drawBars(data, 20, scales, config, id='n_child');
}
