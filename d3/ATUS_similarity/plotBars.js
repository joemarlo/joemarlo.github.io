function getConfigBar(){

}

function getScalesBar(data, config, id){

}

function drawBars(data, scales, config, id){
  
}

function drawBarPlots(data) {
  // delete old plots
  //d3.select("svg.plotHistage").remove()
  //d3.select("svg.plotHistn_child").remove()

  // get config, scales then draw the plots
  let config = getConfigBar();
  let scales = getScalesBar(data, config, 'age');
  drawHistBars(data, 20, scales, config, id='age');
  scales = getScalesBar(data, config, 'n_child');
  drawHistBars(data, 20, scales, config, id='n_child');
}
