console.log('------------------\n-----starting-----\n------------------');

var size = 41;
var options;
var order = 1;
var possible_routes = [1];
var square_size = 15;

function random_color(){
  hue = 'rgb('
        + (255) + ','
        + (100 + Math.floor(Math.random() * 156)) + ','
        + (100 + Math.floor(Math.random() * 156)) + ')';
  return hue;
}

// make a grid, starting with rows
for(y = 0; y < size; y++){
  // add the rows...
  var row = $('<div/>', {
    class: 'row',
  });

    // then add the boxes to the rows
    for(x = 0; x < size; x++){
      $("<div/>", {
        // giving them classes of x0 y0 etc
        class: 'box x'+x+' y'+y,
        // classes are great for selection, but for retrieval of data... not so good, so add data attr's
        'data-x': x,
        'data-y': y,
        // append them
      }).appendTo(row);
    }
  // append the row to the body element  
  row.appendTo("#maze");
}

// find the middle of the grid
var middle = Math.floor(size/2);
// create starting coordinates
var currentX = middle;
var currentY = middle;
// also create placeholder variables for the various options, N,E,S,W
var optionsW, optionsS, optionsN, optionsE;

// we'll work on the 'current_box' when we calculate all the maze paths
var $current_box = $(".x"+middle+".y"+middle);
// give the first (middle) square a random background color, and also give it a data attribute of visited
$current_box.css('background',random_color).attr('data-visited','visited').attr('id','order-'+order);

// this function works out possible next moves, with a given box (i.e. current_box)
function get_possible($box){

  // grab the order of the box, this will be important when we start
  // calculating all the paths that we missed the first time around
  order_id = parseInt($box.attr('id').split("-")[1]);

  // grab its x and y position
  x = parseInt($box.attr("data-x"));
  y = parseInt($box.attr("data-y"));

  // check the squares above, below, left and right of the page
  optionsW = [x - 2, y];
  optionsE = [x + 2, y];
  optionsN = [x, y - 2];
  optionsS = [x, y + 2];
  
  // put all of these into an array
  options = [optionsW, optionsE, optionsN, optionsS];
  
  // If the square is outside the maze (smaller than 0, bigger than the size) cut it out of the potential options
  options = $.grep(options, function(option, index) { 
      return option[0]>=0 && option[0]<size && option[1]>=0 && option[1]<size;
  });

  //then loop through the remaining ones
  for(i=options.length-1; i>=0;i--){
    // make a jquery element in a variable to target them more easily
    $square = $(".x"+options[i][0]+".y"+options[i][1]);
    // check if its already been visited
    if($square.attr('data-visited')=='visited'){
      // if so, remove it
      options.splice(i, 1);
    }
  }

  // if the number of remaining options is more than 0
  if(options.length > 0){
    // choose one of the coordinate pairs
    random_coords = options[Math.floor(Math.random() * options.length)];
    // mark it out on the grid (remove timeout for instant-ish creation)
    setTimeout(function(){
      // here we have the function that actually adds the path
      mark_points(random_coords);
    },10);
  }else{
    // this means that there are no available squares for it to move to from this position
    var index = possible_routes.indexOf(order_id);
    if(index > -1){
      console.log(possible_routes.length);
      // so remove it from our possible_routes array so we never check it again
      possible_routes.splice(index, 1);
    }
    // If there are no possible routes, we're finished, stop the function
    if(possible_routes.length < 1){
      console.log("FINISHED.");
      setup_finished();
      return;
    }else{
      // Otherwise keep going, using the first element in teh possible routes array!
      get_possible($("#order-"+possible_routes[0]))      
    }
  }
}

function mark_points(coords){  
  // get the 'pathway', the square between the current and next square
  pathx = (x + parseInt(coords[0]))/2;
  pathy = (y + parseInt(coords[1]))/2;

  $(".x"+pathx+".y"+pathy).css('background',random_color()).addClass("pathway");

  order ++;
  // change the background color
  $(".x"+coords[0]+".y"+coords[1]).css('background',random_color()).attr('data-visited','visited').attr('id','order-'+order);
  
  // add the new square to the possible routes array
  possible_routes.push(order);
  
  // update the current box object
  $current_box = $("#order-"+order);

  // redo it
  get_possible($current_box);
}

function setup_finished(){
  $("h1").delay(1000).slideDown('fast', function(){
    $("#one").delay(1000).slideDown('fast', function(){
      $("#two").delay(1000).slideDown('fast', function(){
        $("#three").delay(1000).slideDown('fast');
      });
    });
  });
}

// kick everything off!
get_possible($current_box);