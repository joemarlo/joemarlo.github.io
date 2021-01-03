function getConfig() {
  let width = 700;
  let height = 500;
  let margin = {
    top: 70,
    bottom: 50,
    left: 0,
    right: 10
  }

  //The body is the area that will be occupied by the bars.
  let bodyHeight = height - margin.top - margin.bottom;
  let bodyWidth = width - margin.left - margin.right;

  //The container is the SVG where we will draw the chart
  let container = d3.select("#plot_sequence");
  container = container
    .append("svg")
    .attr("class", "plotSequence")
    .attr("width", width)
    .attr("height", height)

    return {width, height, margin, bodyHeight, bodyWidth, container}
  }

function drawRects(data){
  let {margin, bodyHeight, bodyWidth, container} = getConfig()
  container = container.append("g")
    .style("transform",
      `translate(${margin.left}px,${margin.top}px)`
    )

  //console.log('rect data:', data);

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  let myGroups = d3.map(data, function(d){return d.time;}).keys()
  let myVars = d3.map(data, function(d){return d.ID;}).keys()

  // Build X scales
  let x = d3.scaleBand()
    .range([ 0, bodyWidth ])
    .domain(myGroups)
    .padding(0.01);

  // remove and redraw X axis
  tickValues = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47]
  tickLabels = ["4am", 5, 6, 7, 8, 9, 10, 11, "12pm", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, "12am", 1, 2, 3]
  d3.selectAll(".bottomAxisSequence").remove()
  container.append("g")
    .attr("class", "bottomAxisSequence")
    .style("font-size", 15)
    .attr("transform", "translate(0," + bodyHeight + ")")
    .call(d3.axisBottom(x)
      .tickSize(2)
      .tickValues(tickValues)
      .tickFormat(function(d, i){ return tickLabels[i] }))
    .select(".domain").remove()

  // angle the axis tick Labels
  d3.select(".bottomAxisSequence").selectAll("text")
    .attr("y", 10)
    .attr("x", 1)
    .attr("dy", ".35em")
    .attr("transform", "rotate(30)")
    .style("text-anchor", "start");

  // remove and redraw x axis label
  d3.selectAll(".xaxis-label").remove()
  container.append("text")
    .attr("class", "xaxis-label")
    .attr("transform",
          "translate(" + (bodyWidth*1/2) + " ," + (bodyHeight + (margin.bottom*3/4)) + ")")
    .style("text-anchor", "middle")
    .text("Time of day")

  // Build Y scales and axis:
  let y = d3.scaleBand()
    .range([ bodyHeight, 0 ])
    .domain(myVars)
    .padding(0.05);

  // create a tooltip
  let tooltip = d3.select("#plot_sequence")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

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
      .html("<strong>" + d.description + "</strong><br>" +
            "Age: " + d.age + "<br>" +
            "Sex: " + d.sex + "<br>" +
            "Number of children: " + d.n_child + "<br>" +
            "Married: " + d.married + "<br>" +
            "Household income: " + formatter.format(d.HH_income) + "<br>" +
            "Race: " + d.race + "<br>" +
            "Education: " + d.education + "<br>" +
            "State: " + d.state)
      .style("left", (event.pageX + 15) + "px") //(d3.mouse(this)[0]) + "px")
      .style("top", (event.pageY + 15) + "px") //(d3.mouse(this)[1]) + "px")
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
    .style("fill", d => d.val)
    .style("stroke-width", 2)
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

  // remove and add title
  d3.select("#plot_sequence").select(".SequencePlotTitle").selectAll("text").remove()

  // Add title to graph
  d3.select("svg.plotSequence")
    .append("text")
      .attr("class", "SequencePlotTitle")
      .attr("x", margin.left)
      .attr("y", (margin.top / 2))
      .attr("text-anchor", "left")
      .style("font-size", "18px")
      .style("fill", "#4d4d4d")
      .text("The fifty most similar days to yours");

  // Add subtitle to graph
  d3.select("svg.plotSequence")
    .append("text")
      .attr("class", "SequencePlotTitle")
      .attr("x", margin.left)
      .attr("y", (margin.top * 3/4))
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .style("fill", "grey")
      .style("max-width", bodyWidth)
      .text("Each square represents how an individual spent 30 minutes of their day");
}

function filterData(sequences, demographics, inputSequence, modal_sequences, string_table){

  // collapse input sequence into a string
  inputSequenceAsString = Object.keys(inputSequence).map((key) => inputSequence[key].activity).join("")
  //console.log(inputSequenceAsString)

  // classify the user inputted string
  matching_cluster = classifySequence(inputSequenceAsString, modal_sequences)
  console.log("Classified cluster: " + matching_cluster)

  // filter data to just the matching cluster
  sequences = sequences.filter(d => {return d.cluster === matching_cluster})
  demographics = demographics.filter(d => {return d.cluster == matching_cluster})

  // left join the two datasets
  data = mergeOn(indexBy('ID', demographics), 'ID', sequences)

  // create object out of the user input sequence
  splitSeq = inputSequenceAsString.split("")
  userSequence = [];
  for (var i=0; i<48; i++){
    userSequence[i] = {
      ID: "user",
      activity: splitSeq[i],
      cluster: matching_cluster,
      time: (i+1).toString()
    };
  }
  //console.log("Parsed user sequence:", userSequence)

  // add user object to middle of main data frame
  let starting_row = Math.floor(data.length / 2)
  for (var i=starting_row; i<(starting_row+48); i++){
    data[i] = userSequence[(i-starting_row)]
  }

  // left join to get activity names
  data = mergeOn(indexBy('activity', string_table), 'activity', data)
  //console.log("Filtered data:", data)

  return data
}

// retrieve user input
function retrieveUserSequence(string_table){
  userInputSequence = [];
  for (var i=0; i<48; i++){
    userInputSequence[i] = {
      val: document.getElementById("user_input_"+(i+1)).value
    }
  }

  // left join to get string names
  userInputSequence = mergeOn(indexBy('val', string_table), 'val', userInputSequence)
  console.log("Input user sequence:", userInputSequence)

  return userInputSequence;
}

function showData(data){
  sequences = data.sequences
  demographics = data.demographics
  string_table = data.string_table
  //console.log(string_table)

  // get modal strings per cluster and remove the columns key
  modal_sequences = data.modal_sequences
  delete modal_sequences.columns
  modal_sequences = Object.keys(modal_sequences).map((key) => modal_sequences[key].sequence)
  //console.log(modal_sequences)

  // get input sequence
  inputSequence = retrieveUserSequence(string_table)

  // filter the data based on the user and draw the plot
  filtered_data = filterData(sequences, demographics, inputSequence, modal_sequences, string_table)
  drawRects(filtered_data);
  drawHistograms(filtered_data);

  // update plot on user input
  d3.select("#button_update").on("click", function() {
    d3.select("#plot_sequence").select("svg").remove()
    d3.selectAll('.tooltip').remove()
    inputSequence = retrieveUserSequence(string_table);
    filtered_data = filterData(sequences, demographics, inputSequence, modal_sequences, string_table)
    drawRects(filtered_data);
    drawHistograms(filtered_data);
  });
}

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

loadData().then(showData)
