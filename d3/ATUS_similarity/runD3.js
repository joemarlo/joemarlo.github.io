// call the plotting functions in the correct order
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
  drawBarPlots(filtered_data);
  drawHistograms(filtered_data);

  // update plot on user input
  d3.select("#button_update").on("click", function() {
    d3.select("#plot_sequence").select("svg").remove()
    d3.selectAll('.tooltip').remove()
    inputSequence = retrieveUserSequence(string_table);
    filtered_data = filterData(sequences, demographics, inputSequence, modal_sequences, string_table)
    drawRects(filtered_data);
    drawBarPlots(filtered_data);
    drawHistograms(filtered_data);
  });
}

// read in the data
function loadData() {
    return Promise.all([
        d3.csv("/d3/ATUS_similarity/data/sequences.csv"),
        d3.csv("/d3/ATUS_similarity/data/demographics.csv"),
        d3.csv("/d3/ATUS_similarity/data/string_table.csv"),
        d3.csv("/d3/ATUS_similarity/data/modes.csv")
    ]).then(datasets => {
        store = {}
        store.sequences = datasets[0];
        store.demographics = datasets[1];
        store.string_table = datasets[2];
        store.modal_sequences = datasets[3];
        console.log("Loaded data:", store)
        return store;
    })
}

// run it
loadData().then(showData)
