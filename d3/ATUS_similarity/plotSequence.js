function getConfig() {
  let width = 600;
  let height = 450;
  let margin = {
    top: 70,
    bottom: 50,
    left: 20,
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
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 450")
    //.attr("width", width)
    //.attr("height", height)

    return {width, height, margin, bodyHeight, bodyWidth, container}
  }

function drawRects(data){
  let {margin, bodyHeight, bodyWidth, container} = getConfig()
  container = container.append("g")
    .style("transform",
      `translate(${margin.left}px,${margin.top}px)`
    )

  console.log('Data inputted to drawRects():', data);

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  let myGroups = d3.map(data, function(d){return d.time;}).keys()
  let myVars = d3.map(data, function(d){return d.rank;}).keys()

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
  d3.selectAll(".xaxis_label").remove()
  container.append("text")
    .attr("class", "xaxis_label")
    .attr("transform",
          "translate(" + (bodyWidth*3/7) + " ," + (bodyHeight + (margin.bottom*3/4)) + ")")
    .attr('fill', '#4d4d4d')
    .attr('font-size', '0.8em')
    .text("Time of day")

  // Build Y scales and axis:
  let y = d3.scaleBand()
    .range([ bodyHeight, 0 ])
    .domain(myVars)
    .padding(0.05);

  // remove and redraw y axis label
  d3.selectAll(".yaxis_label").remove()
  container.append("text")
    .attr("class", "yaxis_label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - bodyHeight*5/7)
    .attr("y", 0 - 7)
    .attr('fill', '#4d4d4d')
    .attr('font-size', '0.8em')
    .text("More similar individuals ⟶")

  // create a tooltip
  let tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

  // Three function that change the tooltip when user hover / move / leave a cell
  function mouseover(d){
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke-width", 3)
      .style("opacity", 0.5)
  }
  function mousemove(d){
    tooltip
      .html("<strong>" + d.description + "</strong><br>" +
            "Age: " + d.age + "<br>" +
            "Sex: " + d.sex + "<br>" +
            "# children in household: " + d.n_child + "<br>" +
            "Married: " + d.married + "<br>" +
            "Household income: " + formatter.format(d.HH_income) + "<br>" +
            "Race: " + d.race + "<br>" +
            "Education: " + d.education + "<br>" +
            "State: " + d.state)
      .style("left", (d3.event.pageX + 15) + "px") //(d3.mouse(this)[0]) + "px")
      .style("top", (d3.event.pageY + 15) + "px") //(d3.mouse(this)[1]) + "px")
  }
  function mouseleave(d){
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("opacity", 0.9)
      .style("stroke-width", 1)
  }

  // join data with rect
  let squares = container
    .selectAll("rect")
    .data(data, function(d) {return d.time+':'+d.rank;})

  // add the new bars
  squares
    .enter()
    .append("rect") // Add a new rect for each new elements
    .merge(squares) // get the already existing elements as well
    .attr("x", d => x(d.time))
    .attr("y", d => y(d.rank))
    .attr("rx", 0)
    .attr("ry", 0)
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", d => d.val)
    .style("stroke-width", 1)
    .style("stroke", 'white')
    .style("opacity", 0.9)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .transition()
      .duration(750)
      .styleTween("fill", d => d3.interpolate("white", d.val))

  // delete the old squares
  squares
    .exit()
    .remove()

  // remove and add title
  d3.select("#plot_sequence").select(".sequence_plot_title").selectAll("text").remove()

  // Add title to graph
  d3.select("svg.plotSequence")
    .append("text")
      .attr("class", "sequence_plot_title sequence_plot_title_text")
      .attr("x", 0)
      .attr("y", (margin.top / 2))
      .text("The 25 most similar individuals to you");

  // Add subtitle to graph
  d3.select("svg.plotSequence")
    .append("text")
      .attr("class", "sequence_plot_title sequence_plot_subtitle_text")
      .attr("x", 0)
      .attr("y", (margin.top * 3/4))
      .style("max-width", bodyWidth)
      .text("Each square represents how an individual spent 30 minutes of their day");
}
