// Generate body on ready
// Function to toggle color class
// Generate grid w/ [row, col] data-id and the axes numbered w/ data-id=#
// Function to set a timer that captures scope
// Hover binding for axes.
// Click binding for boxes
// Click binding for color chooser
// Row/Column click to generate

;(function(root) {

  var MONDRIAN = root.MONDRIAN = (root.MONDRIAN || {});

  // Returns a string that represents a div holding the axis numbers
  var axisBox = MONDRIAN.axisBox = function(orientation, index) {
    return "<div class='axis " + orientation + "-box' data-id='" + index +"'>" + (parseInt(index) + 1) + "</div>";
  }

  // Generate the axes and actual colorable grid.
  var generateCanvas = MONDRIAN.generateCanvas = function(gridSize) {
    var gs = MONDRIAN.gridSize = (gridSize || 30);

    for(var i = 0; i < gs; i++) {
      $(".columns").append(axisBox('column', i));
      $(".rows").append(axisBox('row', i));

      for(var j = 0; j < gs; j++) {
        $(".canvas").append("<div class='box' data-id='[" + i + "," + j + "]'></div>");
      }
    }
  }

  var bindHandlers = MONDRIAN.bindHandlers = function() {
    bindAxisSelectors();
    bindGenerator('.columns');
    bindGenerator('.rows');

    $("#clear").on("click", function() { reset(); });
  }

  var bindGenerator = MONDRIAN.bindGenerator = function(orientation) {
    var klass = orientation.slice(0,-1) + "-box";
    var i = orientation == ".columns" ? 1 : 0

    $(orientation).on("click", klass, function(event) {
      var $target = $(event.currentTarget);
      var targetIndex = $target.data("id");
      var delay = 0;

      $(".box").each(function(index, box) {
        var $box = $(box)

        if ($box.data("id")[i] == targetIndex) {
          $box.addClass("white");
        }
      });

      $(".box").each(function(index, box) {
        var $box = $(box);
        var random = (Math.floor(Math.random() * MONDRIAN.probabilityToStop));

        if ($box.data("id")[i] == targetIndex) {
          delay += MONDRIAN.delay;
          createTimer($box, delay/4.0);

          if (random == 13) {
            return false;
          }
        }
      })
    });
  }

  var bindAxisSelectors = MONDRIAN.bindAxisSelectors = function() {
    $("body").on("mouseenter", ".box", function(event){
      $target = $(event.currentTarget);
      var row = $target.data("id")[0]
      var col = $target.data("id")[1]

      $(".rows [data-id='" + row + "']").addClass('highlight');
      $(".columns [data-id='" + col + "']").addClass('highlight');
    })

    $("body").on("mouseleave", ".box", function(event){
      $target = $(event.currentTarget);
      var row = $target.data("id")[0]
      var col = $target.data("id")[1]

      $(".rows [data-id='" + row + "']").removeClass('highlight');
      $(".columns [data-id='" + col + "']").removeClass('highlight');
    })
  }

  var createTimer = MONDRIAN.createTimer = function($box, timeout) {
    setTimeout(function() {
      toggleColor($box, randomEl(["red", "blue", "yellow", "gray"]))
    }, timeout);
  }

  var randomEl = MONDRIAN.randomEl = function(array) {
      return array[Math.floor(Math.random() * array.length)]
  }

  var toggleColor = MONDRIAN.toggleColor = function($el, newColor) {
    $el.attr("class", "box");
    $el.addClass(newColor);
  }

  var reset = MONDRIAN.reset = function() {
    $(".rows").empty();
    $(".columns").empty();
    $(".canvas").empty();

    generateCanvas();
  }

  $(function() {
    MONDRIAN.probabilityToStop = 30;
    MONDRIAN.delay = 30;

    generateCanvas();
    bindHandlers();
  })

})(this);