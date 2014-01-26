;(function(root) {

  var MONDRIAN = root.MONDRIAN = (root.MONDRIAN || {});

  // Returns a string that represents a div holding the axis numbers
  var axisBox = MONDRIAN.axisBox = function(orientation, index) {
    return "<div class='axis " + orientation + "-box' data-id='" + index +"'>" + index + "</div>";
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

  // Binds axis selectors, row/column color generation, clear button.
  var bindHandlers = MONDRIAN.bindHandlers = function() {
    bindAxisSelectors();
    bindClickAndDrag();
    bindGenerator('.columns');
    bindGenerator('.rows');

    $("#clear").on("click", reset);
  }

  var bindClickAndDrag = MONDRIAN.bindClickAndDrag = function() {
    $(".canvas").on("mousedown", ".box", function(event) {
      var $initial = $(event.currentTarget);
      var irow = $initial.data("id")[0];
      var icol = $initial.data("id")[1];

      // Colors selected area
      $("body").on("click", ".paint", function(event) {
        $target = $(event.currentTarget);

        var newClass = $target.attr('class').replace(" paint", "");

        $(".selected").attr('class',"box " + newClass);
      });

      // Binds for single click selection (rather than click and drag)
      $(".canvas").on("click", ".box", function(event) {
        $(".selected").each(function(index, box) {
          $(box).removeClass("selected");
        });

        $(".box[data-id='[" + irow + "," + icol + "]']").addClass('selected');
      });

      // Main click and drag logic
      $(".canvas").on("mouseenter", ".box", function(event) {
        var $hovered = $(event.currentTarget);

        var hrow = $hovered.data("id")[0];
        var hcol = $hovered.data("id")[1];

        $(".selected").each(function(index, box) {
          $(box).removeClass("selected");
        })

        // For determining direction of drag
        var idx = irow <= hrow ? irow : hrow
        var jdx = irow <= hrow ? hrow : irow

        var kdx = icol <= hcol ? icol : hcol
        var ldx = icol <= hcol ? hcol : icol

        for(var i = idx; i <= jdx; i++) {
          for(var j = kdx; j <= ldx; j++) {
            $(".box[data-id='[" + i + "," + j + "]']").addClass('selected');
          }
        }
      });
    });

    // Unbinds click and drag handler when mouse is released
    $("body").on("mouseup", function(event) {
      $(".canvas").off("mouseenter", ".box");
    });
  }

  // Checks if a box has colored neighbors that are orthogonal to the direction we're growing color in
  var hasColoredNeighbors = MONDRIAN.hasColoredNeighbors = function(pos, orientation) {
    var i = pos[0]
    var j = pos[1]

    var rright = $(".box[data-id='[" + (i + 1) + "," + j + "]']");
    var rleft = $(".box[data-id='[" + (i - 1) + "," + j + "]']");
    var cright = $(".box[data-id='[" + i + "," + (j + 1) + "]']");
    var cleft = $(".box[data-id='[" + i + "," + (j - 1) + "]']");

    if (orientation == ".columns") {
      var neighbors = [cright, cleft];
    } else {
      var neighbors = [rright, rleft];
    }

    var result = false;

    ["red", "yellow", "blue", "gray"].forEach(function(color) {
      neighbors.forEach(function(box) {
        if (box.hasClass(color)) {
          result = true;
        }
      })
    })

    return result;
  }

  var bindGenerator = MONDRIAN.bindGenerator = function(orientation) {
    var klass = orientation.slice(0,-1) + "-box";
    var i = orientation == ".columns" ? 1 : 0

    $(orientation).on("click", klass, function(event) {
      var $target = $(event.currentTarget);
      var targetIndex = $target.data("id");

      var jQuery_selector = orientation == ".columns" ? "[data-id$='," + targetIndex + "]']" : "[data-id^='[" + targetIndex + ",']"

      var delay = 0;
      var flip = $target.parent().hasClass('right') ? true : false
      var boxes = [];

      $(jQuery_selector).each(function(index, box) {
        var $box = $(box);

        if (!hasColoredNeighbors($box.data("id"), orientation)) {
          $box.addClass("white");
        }

        flip ? boxes.unshift($box) : boxes.push($box);
      });

      boxes.every(function(box) {
        var random = (Math.floor(Math.random() * MONDRIAN.probabilityToStop));

        delay += MONDRIAN.delay;
        createTimer(box, delay/4.0);

        // Choose a random number between 1 and probability to stop.
        if (random == 13) {
          return false;
        } else {
          return true;
        }
      });
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
    MONDRIAN.delay = 100;

    generateCanvas();
    bindHandlers();
  })

})(this);