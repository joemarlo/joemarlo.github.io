function cleanData(data){

  /// add a new column of data denoted the lag between dates
  // split data into each team
  uniqueTeams = d3.map(data, d => d.team).keys()

  // initiate object to hold new data
  newData = []

  for (var i=0; i<uniqueTeams.length; i++){
    // get date and filter the data to that date
    filteredData = data.filter(d => {return d.team == uniqueTeams[i]})

    // add new column with change in rating in last 10 days
    for (var j=0; j<filteredData.length; j++){
      if (j < (filteredData.length-10)){
        filteredData[j]['rating_delta'] = filteredData[j]['rating'] - filteredData[j+10]['rating']
      }
    }

    // add data to dataframe
    newData = newData.concat(filteredData)
  }

  // filter to last 15 days
  uniqueDates = d3.map(data, d => d.date).keys()
  uniqueDates = uniqueDates.sort(d3.descending)
  let nDays = 15
  // TODO: I don't think this date filtering doesn't work
  newData = newData.filter(d => {return d.date >= uniqueDates[nDays]})

  return newData;
}

function getConfig(){
  let width = 800;
  let height = 600;
  let margin = {
      top: 10,
      bottom: 70,
      left: 80,
      right: 50
  }

  //The body is the area that will be occupied by the bars.
  let bodyHeight = height - margin.top - margin.bottom;
  let bodyWidth = width - margin.left - margin.right;

  //The container is the SVG where we will draw the chart
  let container = d3.select("#plotRank")
    .append("svg")
      .attr("class", "plot")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 " + width + " " + height)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

  return {width, height, margin, bodyHeight, bodyWidth, container}
}

function getScales(data, config) {
 let { bodyWidth, bodyHeight } = config;
 let maxX = d3.max(data, d => +d.rating_delta);
 let minX = d3.min(data, d => +d.rating_delta);
 let maxY = d3.max(data, d => +d.rating);
 let minY = d3.min(data, d => +d.rating);

 let xScale = d3.scaleLinear()
     .domain([minX, maxX])
     .range([0, bodyWidth])

 let yScale = d3.scaleLinear()
     .domain([minY, maxY])
     .range([bodyHeight, 0])

 return {xScale, yScale}
}

function drawData(data, config, scales){
  let {margin, container, bodyHeight, bodyWidth, width, height} = config;
  let {xScale, yScale} = scales;
  console.log('Data into drawData():', data)

  // group the data for drawing the historical lines
  let grouped = d3.nest()
    .key(d => d.team)
    .entries(data)
  console.log('Grouped data:', grouped)

  // filter the data for the current data
  // TODO: issue here if teams didn't play today
  uniqueDates = d3.map(data, d => d.date).keys()
  uniqueDates = uniqueDates.sort(d3.descending)
  latestData = data.filter(d => {return d.date >= uniqueDates[0]})

  // add X axis
  container.append("g")
    .attr('class', "axis xAxis")
    .attr("transform", "translate(0," + bodyHeight + ")")
    .call(d3.axisBottom(xScale));
  container.append('text')
    .attr('class', 'axisLabel')
    .attr("transform",
          "translate(" + -margin.left*2/3 + "," + bodyHeight*3/5 + ")rotate(-90)")
    .text("Current rating")

  // Add Y axis
  container.append("g")
    .attr('class', "axis yAxis")
    .call(d3.axisLeft(yScale));
  container.append('text')
    .attr('class', 'axisLabel')
    .attr("transform",
            "translate(" + bodyWidth*3/9 + " ," + (bodyHeight + (margin.bottom*3/5)) + ")")
    .text("Rating change in last 10 days")

  // create a tooltip
  let tooltip = d3.select("#plotRank")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")

  function mouseover(d){
    tooltip
      .style('opacity', 1)

    // de-emphasize other points
    d3.selectAll('.currentPoints')
      .style('opacity', 0.2)

    // emphasize this current point tho
    d3.select(this)
      .style('opacity', 1)
      .style('fill', '#666666')

    // get team name and change the stroke with all values with this team name
    let name = d3.select(this).attr('team')
    d3.selectAll("[team=" + name + "_path]")
      .transition()
        .duration(150)
        .style('stroke-opacity', 1)
    d3.selectAll("[team=" + name + "_circle]")
      .transition()
        .duration(150)
        .style('opacity', 1)

    // highlight row on table
    d3.selectAll('table').select('[team=' + name + ']')
      .style("background-color", '#f1f1f1')
  }

  function mousemove(d){
    tooltip
      .html("<p style='font-weight: 700'>#" + d.rank + ": " + d.team + "</p>Historical ratings shown")
      .style("left", (d3.event.pageX + 20) + "px")
      .style("top", (d3.event.pageY + 20) + "px")
  }

  function mouseleave(d){
    tooltip
      .style('opacity', 0)

    // re-emphasize other points
    d3.selectAll('.currentPoints')
      .style('opacity', 0.8)
      .style('fill', '#adadad')

    // get team name and change the stroke with all values with this team name
    let name = d3.select(this).attr('team')
    d3.selectAll("[team=" + name + "_path]")
      .transition()
        .duration(100)
        .style('stroke-opacity', 0)
    d3.selectAll("[team=" + name + "_circle]")
      .transition()
        .duration(100)
        .style('opacity', 0)

    // de-highlight row on table
    d3.selectAll('table').select('[team=' + name + ']')
      .style("background-color", '#fff')
  }

  // add quadrant identifiers
  container.append("text")
    .attr("class", "quadrantText")
    .attr("transform",
          "translate(" + 35 + "," + bodyHeight*1/5 + ")")
    .style("text-anchor", "center")
    .html("HIGH BUT DECLINING")
 container.append("text")
    .attr("class", "quadrantText")
    .attr("transform",
          "translate(" + 400 + "," + bodyHeight*1/5 + ")")
    .style("text-anchor", "center")
    .html("HIGH AND INCREASING")
  container.append("text")
    .attr("class", "quadrantText")
    .attr("transform",
          "translate(" + 35 + "," + bodyHeight*4/5 + ")")
    .style("text-anchor", "center")
    .html("LOW AND DECLINING")
 container.append("text")
    .attr("class", "quadrantText")
    .attr("transform",
          "translate(" + 400 + "," + bodyHeight*4/5 + ")")
    .style("text-anchor", "center")
    .html("LOW BUT INCREASING")

  // add vertical line
  container.append("line")
    .attr("x1", xScale(0))
    .attr('y1', 0)
    .attr('x2', xScale(0))
    .attr('y2', bodyHeight)
    .style("stroke-width", 1.5)
    .style("stroke-dasharray", ("3, 3"))
    .style("stroke", "#c4c4c4")
    .style("fill", "none");

  // add vertical line
  let meanY = d3.mean(data, d => +d.rating);
  container.append("line")
    .attr("x1", 0)
    .attr('y1', yScale(meanY))
    .attr('x2', bodyWidth)
    .attr('y2', yScale(meanY))
    .style("stroke-width", 1.5)
    .style("stroke-dasharray", ("3, 3"))
    .style("stroke", "#c4c4c4")
    .style("fill", "none");

  // add historical lines
  var myColor = d3.scaleLinear()
    .domain([-200,200])
    .range(["white", "blue"])
  let historicalLine = d3.line()
      .curve(d3.curveCatmullRom.alpha(1))
      .x(d => xScale(d.rating_delta))
      .y(d => yScale(d.rating))

  container.append('g')
      .selectAll('lines')
      .data(grouped)
      .enter()
      .append("path")
        .attr('d', d => historicalLine(d.values))
        .style('stroke-width', 1.5)
        .attr('stroke', '#666666')
        .style('fill', 'none')
        .style('stroke-opacity', 0)
        .attr('team', d => d.key + "_path")

  // add historical points
  container.append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => xScale(d.rating_delta))
      .attr("cy", d => yScale(d.rating))
      .attr("r", 4)
      .style("fill", "#666666")
      .style("stroke", '#fff')
      .style('opacity', 0)
      .attr('team', d => d.team + "_circle")

  // add current points
  container.append('g')
    .selectAll("dot")
    .data(latestData)
    .enter()
    .append("circle")
      .attr("cx", d => xScale(d.rating_delta))
      .attr("cy", d => yScale(d.rating))
      .attr("r", 10)
      .style('opacity', 0.8)
      .style("fill", "#adadad")
      .style('stroke', '#fff')
      .attr('class', 'currentPoints')
      .attr('team', d => d.team)
      .attr('teamShape', d => d.team + "_currentCircle")
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave)
}

function buildPlot(data){
  filteredData = cleanData(data)
  config = getConfig()
  scales = getScales(filteredData, config)
  drawData(filteredData, config, scales)
}
