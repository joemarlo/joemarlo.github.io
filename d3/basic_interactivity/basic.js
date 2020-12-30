
let store = {}

// function to read data if we'd rather use fixed data
function loadData() {
    return Promise.all([
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv")
    ]).then(datasets => {
        store.prices = datasets[0];
        return store;
    })
}

// function to simulate normal distribution
function getData(n, mean, sd){
  store.rand = d3.range(n).map(function(){
    //num = Math.random()*1000
    num = jStat.normal.sample(mean, sd)
    num = num.toString()
    return {'price': num}
  })
}

function getConfig() {
   let width = 700;
   let height = 500;
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
   let container = d3.select("#main_histogram" );
   container
       .attr("width", width)
       .attr("height", height)

   return { width, height, margin, bodyHeight, bodyWidth, container }
}

function getScales(prices, config) {
 let { bodyWidth, bodyHeight, container } = config;
 let maximumValue = d3.max(prices, d => +d.price);
 let minimumValue = d3.min(prices, d => +d.price);

 let xScale = d3.scaleLinear()
     .domain([-600, 600]) //[minimumValue, maximumValue]
     .range([0, bodyWidth])
 let yScale = d3.scaleLinear()
     .range([bodyHeight, 0])

 return { xScale, yScale}
}

function drawBars(prices, nbins, scales, config){
  let {margin, container, bodyHeight, bodyWidth} = config;
  let {xScale, yScale} = scales

  // set the parameters for the histogram
  let histogram = d3.histogram()
        .value(function(d) { return d.price; })
        .domain(xScale.domain())
        .thresholds(xScale.ticks(nbins));

  // get the binned data
  let bins = histogram(prices);

  // remove and redraw X axis
  d3.selectAll(".bottomaxis").remove()
  container.append("g")
    .attr("class", "bottomaxis")
    .attr("transform", "translate(" + margin.left + "," + (bodyHeight) + ")")
    .call(d3.axisBottom(xScale));

  // remove and redraw Y axis
  yScale.domain([0, d3.max(bins, function(d) { return d.length; })]);
  d3.selectAll(".leftaxis").remove()
  container.append("g")
    .attr("class", "leftaxis")
    .call(d3.axisLeft(yScale))
    .style("transform",
      `translate(${margin.left}px, 0px)`
    )

  // join data with rect
  let rects = container
    .selectAll("rect")
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

  // delete the old bars
  rects
    .exit()
    .remove()
 }

function drawHistogram(prices, nbins) {
  let config = getConfig();
  let scales = getScales(prices, config);
  drawBars(prices, nbins, scales, config);
}

function showData() {
    // initialize values
    let current_bins = 50
    let current_mean = 50
    let current_sd = 100
    let n_datapoints = 5000

    // simulate initial data
    getData(n_datapoints, current_mean, current_sd)
    let prices = store.rand
    //let prices = store.prices
    console.log(prices)

    // initialize plot
    drawHistogram(prices, current_bins);

    // update n bins on user input
    d3.select("#input_bins").on("input", function() {
      current_bins = +this.value
      drawHistogram(prices, current_bins);
    });

    // update distribution mean on user input
    d3.select("#input_mean").on("input", function() {
      current_mean = +this.value
      getData(n_datapoints, current_mean, current_sd);
      prices = store.rand
      drawHistogram(prices, current_bins)
    });

    // update distribution sd on user input
    d3.select("#input_sd").on("input", function() {
      current_sd = +this.value
      getData(n_datapoints, current_mean, current_sd);
      prices = store.rand
      drawHistogram(prices, current_bins)
    });

    // update n datapoints on user input
    d3.select("#input_n_data").on("input", function() {
      n_datapoints = +this.value
      getData(n_datapoints, current_mean, current_sd);
      prices = store.rand
      drawHistogram(prices, current_bins)
    });
}

loadData().then(showData);
