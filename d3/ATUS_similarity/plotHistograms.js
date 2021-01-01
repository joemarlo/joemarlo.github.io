
function getConfigHist() {
   let width = 700;
   let height = 400;
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
   container = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)

   return {width, height, margin, bodyHeight, bodyWidth, container}
}

function getScalesHist(data, config) {
 let { bodyWidth, bodyHeight, container } = config;

 // if data is a number then scale it for a histogram, otherwise for a barplot
 if (Number.isFinite(+data[1].dataToPlot)){
   let maximumValue = d3.max(data, d => +d.dataToPlot);
   let minimumValue = d3.min(data, d => +d.dataToPlot);
   console.log(d3.max(data, d => +d.dataToPlot))

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
       let dataToPlot = d.dataToPlot;
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
    .domain(bins) // TODO need to pivot data
    .range([0, bodyWidth])
    .padding(0.2)

   let yScale = d3.scaleLinear()
    .domain([0, maximumValue])
    .range([bodyHeight, 0]);
 }
}

function drawBars(data, nbins, scales, config){
  let {margin, container, bodyHeight, bodyWidth} = config;
  let {xScale, yScale} = scales

  console.log('data input to drawBars', data)

  // if the data is a number then plot a histogram, else plot barplot chart
  isfinite = Number.isFinite(+data[1].dataToPlot)
  console.log("is data numeric?", isfinite)
  if (isfinite){

    // set the parameters for the histogram
    let histogram = d3.histogram()
          .value(d => +d.dataToPlot)
          .domain(xScale.domain())
          .thresholds(xScale.ticks(nbins));

    // get the binned data
    let bins = histogram(data);

    // remove and redraw X axis
    d3.selectAll(".bottomaxisHist").remove()
    container.append("g")
      .attr("class", "bottomaxisHist")
      .attr("transform", "translate(" + margin.left + "," + bodyHeight + ")")
      .call(d3.axisBottom(xScale));

    // remove and redraw Y axis
    yScale.domain([0, d3.max(bins, d => d.length)]);

    // join data with rect
    let rects = container
      .selectAll("rectHist")
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
        .attr("class", "rectHist")
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
        let dataToPlot = d.dataToPlot;
        if(bins[dataToPlot] === undefined) {
            bins[dataToPlot] = 0;
        } else {
            bins[dataToPlot] = bins[dataToPlot] + 1;
        }
    });

    // join data with rect
    let rects = container
      .selectAll("rectHist")
      .data(bins)

    // add the new bars
    rects
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(rects) // get the already existing elements as well
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return bodyHeight - yScale(d.value); })
        .style("fill", "#394E48")
        .attr("class", "rectHist")
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
  /*
  data.demographics.age
  data.demographics.sex
  data.demographics.education
  data.demographics.married
  data.demographics.n_child
  */
  //let demographics = data.demographics
  let demographics = data

  // delete old plots

  for (var i=0; i<demographics.length; i++){
    demographics[i]['dataToPlot'] = demographics[i]['age']
  }

  let config = getConfigHist();
  let scales = getScalesHist(demographics, config);
  drawBars(demographics, 20, scales, config);
}

function loadData() {
    return Promise.all([
        d3.csv("data/sequences.csv"),
        d3.csv("data/demographics.csv"),
        d3.csv("data/string_table.csv"),
        d3.csv("data/modes.csv")
    ]).then(datasets => {
        store = {}
        store.sequences = datasets[0];
        store.demographics = datasets[1];
        store.string_table = datasets[2];
        store.modal_sequences = datasets[3];
        console.log(store)
        return store;
    })
}

//loadData().then(drawHistograms)
