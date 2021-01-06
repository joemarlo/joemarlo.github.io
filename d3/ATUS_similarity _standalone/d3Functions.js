// function to filter and sort the sequence data based on the input string
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

  // add the user to the data
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

  /// sort the data based on string match score
  // first group the data from ID
  let grouped = d3.nest()
    .key(d => d.ID)
    .entries(data)

  // for each ID, convert the activity to a string
  let populationSequencesAsStrings = []
  for (var i=0; i<grouped.length; i++){
    popSequence = grouped[i]['values']
    populationSequencesAsStrings[i] = Object.keys(popSequence).map((key) => popSequence[key].activity).join("")
  }

  // compute the similarity scores from the user input to the population of strings
  //stringMatchScores = stringSimilarity.findBestMatch(inputSequenceAsString, populationSequencesAsStrings).ratings
  stringMatchScores = populationSequencesAsStrings.map(string => getEditDistance(inputSequenceAsString, string))

  // invert scores and place in object
  stringMatchScores = stringMatchScores.map(function(score){return {rating : d3.max(stringMatchScores) - score}})

  /// sort the data by these scores
  // add ID column to string scores
  for (var i=0; i<grouped.length; i++){
    stringMatchScores[i]['ID'] = Object.values(grouped[i])[0]
  }

  // rank the scores
  stringMatchScores = stringMatchScores.sort(function(a,b) { return +a.rating - +b.rating })
  for (var i=0; i<stringMatchScores.length; i++){
    stringMatchScores[i]['rank'] = i
  }

  // join back to original data and sort
  rankedData = mergeOn(indexBy('ID', stringMatchScores), 'ID', data)
  rankedData.sort(function(a,b) { return +a.rank - +b.rank })

  // filter to just the top 50 ranked observations
  maxRank = d3.max(rankedData, d => d.rank)
  rankedFilteredData = rankedData.filter(d => {return d.rank >= (maxRank - 25)})

  return rankedFilteredData
}

// retrieve user input and convert to string
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

// function to count categorical data
function countData(data, id){
  counts = d3.nest()
  .key(d => d[id])
  .rollup(d => d.length)
  .entries(demographics);

  return counts
}
