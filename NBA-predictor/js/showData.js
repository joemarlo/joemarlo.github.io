function showData(data){
  buildGrid(data.predictions)
  buildTable(data.ratings)
  buildPlot(store.ratings)
//  buildPlot(data.ratings)
}

// read in the data
function loadData() {
    return Promise.all([
        d3.csv("Data/game_predictions.csv"),
        d3.csv("Data/team_ratings.csv")
    ]).then(datasets => {
        store = {},
        store.predictions = datasets[0];
        store.ratings = datasets[1];
        console.log("Loaded data:", store)
        return store;
    })
}

// run it
loadData().then(showData)
