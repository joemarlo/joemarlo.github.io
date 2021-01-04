// set default sequence
var arrColors = [
  {val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#58df8c'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'},{val : '#154e56'}
]

// create 48 select lists
// first set the select dropdown options
var arrSelect = [
  {val : '#208eb7', text: 'Sports, Exercise, and Recreation'}, {val : '#65e6f9', text: 'Personal Care'}, {val : '#154e56', text: 'Sleep'}, {val : '#58df8c', text: 'Socializing, Relaxing, and Leisure'}, {val : '#966106', text: 'Household Activities'}, {val : '#b5d08d', text: 'Work'}, {val : '#6d3918', text: 'Professional & Personal Care Services'}, {val : '#f24325', text: 'Eating and Drinking'}, {val : '#8e1023', text: 'Caring For Household Member'}, {val : '#c27d92', text: 'Consumer Purchases'}, {val : '#fbcab9', text: 'Other'}, {val : '#ff0087', text: 'Caring For Nonhousehold Members'}, {val : '#fd8f2f', text: 'Education'}, {val : '#bce333', text: 'Volunteer'}, {val : '#798a58', text: 'Religious and Spiritual'}
];

let tickLabels = ["4am", 5, 6, 7, 8, 9, 10, 11, "12pm", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, "12am", 1, 2, 3]

// iterate through and create the select dropdowns and set them to the approporiate
// colors to match the default sequence
for (var i=0; i<48; i++){
  var sel = $('<select>').appendTo('#container_user_input');
  sel.addClass("user_input");
  sel.attr('id', 'user_input_'+(i+1))

  // append values to select
  $(arrSelect).each(function() {
    sel.append($("<option>").attr('value',this.val).text(this.text));
  });

  // set default values and colors
  selected_sequence = arrColors[i].val
  $('#user_input_'+ (i+1) + ' option[value="' + selected_sequence + '"]').attr("selected", true);
  sel.css('background-color', selected_sequence)
  sel.css('color', selected_sequence)

  /*
  // add tick marks under the container
  var selTick = $('<div>').appendTo('#container_user_input_ticks');
  selTick.addClass("vertical_tick_empty");
  if (i % 2 == 0) selTick.addClass("vertical_tick");

  // add labels under ticks
  var selLabel = $('<div>').appendTo('#container_user_input_labels');
  selLabel.addClass("vertical_tick_label");
  if (i % 2 == 0) selLabel.html(tickLabels[i/2]);
  */
}

// change the color of the dropdown based on its value
var i;
$('.user_input').change(function(){
    i = this.id.slice(11);
    $("#user_input_"+i).css('background-color', $(this).val());
    $("#user_input_"+i).css('color', $(this).val());
});
