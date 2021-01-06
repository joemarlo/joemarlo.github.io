// define example sequences
example_cols = ['#154e56', '#154e56', '#154e56', '#154e56', '#65e6f9', '#f24325', '#58df8c', '#58df8c', '#58df8c', '#58df8c', '#58df8c', '#f24325', '#58df8c', '#58df8c', '#58df8c', '#58df8c', '#58df8c', '#f24325', '#65e6f9', '#154e56',  '#154e56',  '#154e56',  '#154e56']

// iterate through and create the select dropdowns
for (var i=0; i<24; i++){
  // create new div
  let new_div = $('<div>').appendTo('#container_example')
  new_div.addClass('example_div')
  new_div.attr('id', 'example_div'+(i+1))

  // append svg to the div
  svg = d3.select('#example_div'+(i+1))
    .append("svg")
    .attr('class', 'example_rect')
    .attr("height", '100%')
    .attr("width", '100%')
  svg
    .append('rect')
    .attr('height', '100%')
    .attr('width', '100%')
    .attr('fill', example_cols[i])
}

// define the 7 'typical' sequences that are returned from 20Q. These is generated from generate_html.R
let proto1 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#65e6f9'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

let proto2 = [ {val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#f24325'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#f24325'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'} ]

let proto3 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#f24325'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#f24325'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#966106'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#65e6f9'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

let proto4 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#f24325'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#fd8f2f'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

let proto5 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#f24325'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#f24325'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#f24325'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

let proto6 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#f24325'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#f24325'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

let proto7 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#b5d08d'},{val : '#f24325'},{val : '#65e6f9'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

let proto8 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#f24325'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#f24325'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#8e1023'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#65e6f9'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

let proto9 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#f24325'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#f24325'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#bce333'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#65e6f9'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

let proto10 = [ {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#65e6f9'},{val : '#f24325'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#f24325'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#798a58'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#f24325'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#65e6f9'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'} ]

// create mapping between color values and text
var arrSelect = [
  {val : '#208eb7', text: 'Sports, Exercise, and Recreation'}, {val : '#65e6f9', text: 'Personal Care'}, {val : '#154e56', text: 'Sleep'}, {val : '#58df8c', text: 'Socializing, Relaxing, and Leisure'}, {val : '#966106', text: 'Household Activities'}, {val : '#b5d08d', text: 'Work'}, {val : '#6d3918', text: 'Professional & Personal Care Services'}, {val : '#f24325', text: 'Eating and Drinking'}, {val : '#8e1023', text: 'Caring For Household Member'}, {val : '#c27d92', text: 'Consumer Purchases'}, {val : '#fbcab9', text: 'Other'}, {val : '#ff0087', text: 'Caring For Nonhousehold Members'}, {val : '#fd8f2f', text: 'Education'}, {val : '#bce333', text: 'Volunteer'}, {val : '#798a58', text: 'Religious and Spiritual'}
];

let tickLabels = ["4am", 5, 6, 7, 8, 9, 10, 11, "12pm", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, "12am", 1, 2, 3]

// function to return cluster based on results from questions
function arrColorsFun(){
  if ($('#Q1').val() == "Yes"){
    Q2 = $('#Q2').val()
    if (Q2 == "Early morning") return proto6
    if (Q2 == 'Morning') return proto5
    if (Q2 == 'Afternoon') return proto7
    if (Q2 == 'Evening') return proto2
  }

  if ($('#Q3').val() == 'Yes') return proto4

  Q4 = $('#Q4').val();
  if (Q4 == 'Socializing, relaxation, leisure') return proto1
  if (Q4 == 'Household activities') return proto3
  if (Q4 == 'Care for others') return proto8
  if (Q4 == 'Volunteering') return proto9
  if (Q4 == 'Religious') return proto10
}

// iterate through and create the select dropdowns
function createInputDropdowns(){
  for (var i=0; i<48; i++){
    // create new div
    let new_div = $('<div>').appendTo('#container_user_input')
    new_div.addClass('user_input_div')
    new_div.attr('id', 'user_input_div_'+(i+1))

    // append select to the div
    let sel = $('<select>').appendTo(new_div);
    sel.addClass("user_input");
    sel.attr('id', 'user_input_'+(i+1))

    // append values to select
    $(arrSelect).each(function() {
      sel.append($("<option>").attr('value',this.val).text(this.text));
    });

    // add an svg so we can add ticks and time labels
    svg = d3.select('#user_input_div_'+(i+1))
      .append("svg")
      .attr("height", 50)
      .attr("width", 12)

    /* //add the tick
    svg
      .append('line')
        .attr("x1", '50%')
        .attr("y1", 0)
        .attr("x2", '50%')
        .attr("y2", '50%')
        .attr("class", "vertical_tick")
      */

    // add the time label
    if (i % 2 == 0)
    svg
      .append('text')
        .attr("y", "-10%")
        .text(tickLabels[i/2])
        .attr("transform", "rotate(90)")
  }
}

// update the dropdowns selected values and color
function updateInputDropdowns(arrColors){
  for (var i=0; i<48; i++){
    let sel = $("#user_input_"+(i+1))

    // set default values and colors
    selected_sequence = arrColors[i].val
    sel.val(selected_sequence)
    sel.css('background-color', selected_sequence)
    sel.css('color', selected_sequence)
  }
}

// initalize dropdowns and question results
createInputDropdowns();
let arrColors = arrColorsFun()
updateInputDropdowns(arrColors);
//updateInputDropdowns(clusterOther);

// add listeners to render the followup questions
$('#Q1').change(function(){
  if ($(this).val() == 'Yes') {
    $('#container_Q2').css('display', 'unset')
    $('#container_Q3').css('display', 'none')
    $('#container_Q4').css('display', 'none')
  } else {
    $('#container_Q2').css('display', 'none')
    $('#container_Q3').css('display', 'unset')
    if ($('#Q3').val() == "No") $('#container_Q4').css('display', 'unset')
  }
})
$('#Q3').change(function(){
  if ($(this).val() == 'Yes') {
    $('#container_Q4').css('display', 'none')
  } else {
    $('#container_Q4').css('display', 'unset')
  }
})

// add listeners to each question
let elementsArray = document.querySelectorAll("#container_twenty_questions");
elementsArray.forEach(function(elem) {
  elem.addEventListener("change", function() {
    arrColors = arrColorsFun();
    updateInputDropdowns(arrColors);
  });
});

// add listener to change the color of the dropdown based on its value
$('.user_input').change(function(){
    $(this).css('background-color', $(this).val());
    $(this).css('color', $(this).val());
});
