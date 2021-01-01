// function to read data if we'd rather use fixed data
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

function getConfig() {
  let width = 700;
  let height = 800;
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
  let container = d3.select("#plot_sequence");
  container = container
    .append("svg")
    .attr("class", "plot")
    .attr("width", width)
    .attr("height", height)

    return {width, height, margin, bodyHeight, bodyWidth, container}
  }

//Read the data
//d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {
//d3.csv("data/tmp.csv", function(data) {

function drawRects(data){
  let {margin, bodyHeight, bodyWidth, container} = getConfig()

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(data, function(d){return d.time;}).keys()
  var myVars = d3.map(data, function(d){return d.ID;}).keys()

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, bodyWidth ])
    .domain(myGroups)
    .padding(0.01);
  // remove and redraw X axis
  d3.selectAll(".bottomaxis").remove()
  container.append("g")
    .attr("class", "bottomaxis")
    .style("font-size", 15)
    .attr("transform", "translate(0," + bodyHeight + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // remove and redraw x axis label
  d3.selectAll(".xaxis-label").remove()
  container.append("text")
    .attr("class", "xaxis-label")
    .attr("transform",
          "translate(" + (bodyWidth*1/2) + " ," + (bodyHeight + margin.bottom) + ")")
    .style("text-anchor", "middle")
    .text("Time of day")

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ bodyHeight, 0 ])
    .domain(myVars)
    .padding(0.05);
  /*
  container.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()
    */

  // Build color scale TODO expand to 15 colors!!!
  // https://github.com/d3/d3-scale-chromatic#interpolateSpectral
  var myColor = d3.scaleOrdinal(d3.schemeSpectral[11])

  // create a tooltip
  var tooltip = d3.select("#plot_sequence")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  function mouseover(d){
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  function mousemove(d){
    tooltip
      .html("Activity: " + d.description + "<br>" +
            "Age: " + d.age + "<br>" +
            "Sex: " + d.sex + "<br>" +
            "Number of children: " + d.n_child + "<br>" +
            "Household income: " + formatter.format(d.HH_income) + "<br>" +
            "Race: " + d.race + "<br>" +
            "Education: " + d.education)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  function mouseleave(d){
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", function(d, i){
        if (d.ID == "user"){
          return "white"
        }
        return "none";
      })
      .style("opacity", 0.8)
  }

  // join data with rect
  let squares = container
    .selectAll("rect")
    .data(data, function(d) {return d.time+':'+d.ID;})

  // add the new bars
  squares
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(squares) // get the already existing elements as well
    .attr("x", d => x(d.time))
    .attr("y", d => y(d.ID))
    .attr("rx", 0)
    .attr("ry", 0)
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", d => myColor(d.activity))
    .style("stroke-width", 2)
    .style("stroke", "none")
    .style("stroke", function(d, i){
      if (d.ID == "user"){
        return "white"
      }
      return "none";
    })
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  // delete the old squares
  squares
    .exit()
    .remove()
}

function addTitle(){
  let {container} = getConfig()

  // Add title to graph
  container.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("A d3.js heatmap");

  // Add subtitle to graph
  container.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .style("max-width", 400)
          .text("A short description of the take-away message of this chart.");
}

function filterData(sequences, demographics, inputSequence, modal_sequences, string_table){

  // classify the user inputted string
  matching_cluster = classifySequence(inputSequence, modal_sequences)
  console.log("Classified cluster: " + matching_cluster)

  // filter data to just the matching cluster
  sequences = sequences.filter(d => {return d.cluster === matching_cluster})
  demographics = demographics.filter(d => {return d.cluster == matching_cluster})

  // left join the two datasets
  data = mergeOn(indexBy('ID', demographics), 'ID', sequences)

  // left join to get activity names
  data = mergeOn(indexBy('activity', string_table), 'activity', data)

  // create object out of the user input sequence
  splitSeq = inputSequence.split("")
  userSequence = [];
  for (var i=0; i<48; i++){
    userSequence[i] = {
      ID: "user",
      activity: splitSeq[i],
      cluster: matching_cluster,
      time: (i+1).toString()
    };
  }
  console.log("Parsed user sequence:", userSequence)

  // add user object to middle of main data frame
  let starting_row = Math.floor(data.length / 2)
  for (var i=starting_row; i<(starting_row+48); i++){
    data[i] = userSequence[(i-starting_row)]
  }

  return data
}

function showData(data){
  sequences = data.sequences
  demographics = data.demographics
  string_table = data.string_table
  //modal_sequences = d3.map(data.modal_sequences, d => d.sequence).values(sequence)
  modal_sequences = modal_sequences
  //console.log(modal_sequences)

  // default input sequence
  inputSequence = "CCCCCCCCCCDDDDDDDDDDDDDDDDDDDDDDDDDDDDCCCCCCCCCC"

  filtered_data = filterData(sequences, demographics, inputSequence, modal_sequences, string_table)
  drawRects(filtered_data);

  // update plot on user input
  d3.select("#button_update").on("click", function() {
    d3.select("svg.plot").remove()
    d3.selectAll('.tooltip').remove()
    //inputSequence = this.value
    inputSequence = document.getElementById("input_sequence").value;
    filtered_data = filterData(sequences, demographics, inputSequence, modal_sequences, string_table)
    drawRects(filtered_data)
  });
  //addTitle()
}


loadData().then(showData)
