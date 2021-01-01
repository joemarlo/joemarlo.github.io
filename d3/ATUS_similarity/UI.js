// set default sequence
var arrColors = [
  {val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},
  {val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},
  {val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},
  {val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},
  {val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},
  {val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},
  {val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},
  {val : '#F79B5D'},{val : '#F79B5D'},{val : '#F79B5D'},{val : '#6A3D9A'},{val : '#6A3D9A'},
  {val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'},
  {val : '#6A3D9A'},{val : '#6A3D9A'},{val : '#6A3D9A'}
]

// create 48 select lists
// first set the select dropdown options
var arrSelect = [
  {val : "#D9A398", text: 'Sports, Exercise, and Recreation'},
  {val : "#4F96C4", text: 'Personal Care'},
  {val : "#6A3D9A", text: 'Sleep'},
  {val : "#F79B5D", text: 'Socializing, Relaxing, and Leisure'},
  {val : "#A788C0", text: 'Household Activities'},
  {val : "#A6CEE3", text: 'Work'},
  {val : "#4995A8", text: 'Professional & Personal Care Services'},
  {val : "#FDA33F", text: 'Eating and Drinking'},
  {val : "#EF595A", text: 'Caring For Household Member'},
  {val : "#5D9E43", text: 'Consumer Purchases'},
  {val : "#DE9A89", text: 'Other'},
  {val : "#E63127", text: 'Caring For Nonhousehold Members'},
  {val : "#A7D78D", text: 'Education'},
  {val : "#69BB54", text: 'Volunteer'},
  {val : "#FB820F", text: 'Religious and Spiritual'}
];

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
  selected_sequence = arrColors[i].val //"#5E4FA2"
  $('#user_input_'+ (i+1) + ' option[value="' + selected_sequence + '"]').attr("selected", true);
  sel.css('background-color', selected_sequence)
  sel.css('color', selected_sequence)
}

// change the color of the dropdown based on its value
var i;
$('.user_input').change(function(){
    i = this.id.slice(11);
    $("#user_input_"+i).css('background-color', $(this).val());
    $("#user_input_"+i).css('color', $(this).val());
});
