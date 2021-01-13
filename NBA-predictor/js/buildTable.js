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

  // reorganize data to 1:15 and 16:30
  rankedDataWide = rankedData.filter(d => d.rank <= rankedData.length/2)
  for (var i=0; i<(rankedData.length/2); i++){
    rankedDataWide[i]['rank1'] = rankedData[i].rank
    rankedDataWide[i]['rating_string1'] = rankedData[i].rating_string
    rankedDataWide[i]['team1'] = rankedData[i].team

    // add second group of columns
    j = i + Math.floor(rankedData.length/2)
    rankedDataWide[i]['empty'] = ""
    rankedDataWide[i]['rank2'] = rankedData[j].rank
    rankedDataWide[i]['rating_string2'] = rankedData[j].rating_string
    rankedDataWide[i]['team2'] = rankedData[j].team
  }

  console.log('here', rankedDataWide)

  // columns to include in table
  //columns = ['rank', 'team', 'rating_string']
  //columnNames = ['Rank', 'Team', 'Rating']
  columns = ['rank1', 'team1', 'rating_string1', 'empty', 'rank2', 'team2', 'rating_string2']
  columnNames = ['Rank', 'Team', 'Rating', "", 'Rank', 'Team', 'Rating']

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
      .data(rankedDataWide)
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
