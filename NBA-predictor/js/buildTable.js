function buildTable(data){
  // filter to latest date
  // TODO: need to revise this to latest date *per team*
  uniqueDates = d3.map(data, d => d.date).keys()
  uniqueDates = uniqueDates.sort(d3.descending)
  filteredData = data.filter(d => {return d.date == uniqueDates[0]})

  // create rankings
  rankedData =  filteredData.sort((a, b) => d3.descending(a.rating, b.rating))

  // add rank column and clean up rating
  for (var i=0; i<rankedData.length; i++){
    rankedData[i]['rank'] = i+1
    rankedData[i]['rating_string'] = parseFloat(rankedData[i]['rating']).toFixed(0)
  }

  // columns to include in table
  columns = ['rank', 'team', 'rating_string']
  columnNames = ['Rank', 'Team', 'Rating']

  // create table
  let table = d3.select('#tableRank').append('table')
    let thead = table.append('thead')
    let tbody = table.append('tbody')

    // create the table head
    thead.append('tr')
      .selectAll('th')
      .data(columnNames)
      .enter()
    .append('th')
      .text(d => d)

    let rows = tbody.selectAll('tr')
      .data(rankedData)
      .enter()
    .append('tr')

    let cells = rows.selectAll('td')
      .data(function(row){
        return columns.map(function(column){
          return { column: column, value: row[column]}
        })
      })
      .enter()
    .append('td')
      .text(d => d.value)

}
