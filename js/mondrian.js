Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function toggleColor($el, newColor) {
  $el.attr("class", "box");
  $el.addClass(newColor);
}

function createTimer($box, timeout) {
  setTimeout(function() {
    toggleColor($box, ["red", "blue", "yellow", "gray"].randomElement())
  }, timeout);
}

$(function() {
  for(var i = 0; i < 30; i++) {
    $(".columns").append("<div class='column-box' data-id='" + i + "'>" + (parseInt(i) + 1) + "</div>")
    $(".rows").append("<div class='column-box' data-id='" + i + "'>" + (parseInt(i) + 1) + "</div>")
    for(var j = 0; j < 30; j++) {
      $(".canvas").append("<div class='box' data-id='[" + i + "," + j + "]'></div>");
    }
  }

  $(".box").hover(function(event) {
    var $e = $(event.currentTarget);

    var pos = [$e.data("id")[0], $e.data("id")[1]];

    // console.log("[data-id='" + pos + "']");

    $(".rows [data-id='" + pos[0] + "']").addClass('pink');
    $(".columns [data-id='" + pos[1] + "']").addClass('pink');
  }, function(event) {
    var $e = $(event.currentTarget);

    var pos = [$e.data("id")[0], $e.data("id")[1]];

    // console.log("[data-id='" + pos + "']");

    $(".rows [data-id='" + pos[0] + "']").removeClass('pink');
    $(".columns [data-id='" + pos[1] + "']").removeClass('pink');
  });

  $(".box").on("click", function(event) {
    $e = $(event.currentTarget);

    toggleColor($e, ["red", "blue", "yellow", "gray"].randomElement());
  })

  $("span").on("click", function(event) {
    $e = $(event.currentTarget);
    console.log($e.attr('id'));
  })

  $(".rows").on("click", ".column-box", function(event) {
    $e = $(event.currentTarget);
    var column = $e.data("id");

    console.log(column);
    var delay = 0;

    $(".box").each(function(index, box) {
      var random = (Math.floor(Math.random() * 30));

      $box = $(box);

      if ($box.data("id")[0] == column) {
        delay += 30;
        createTimer($box, delay/4.0);

        if (random == 13) {
          console.log("FOUND 13");
          return false;
        }
      }
    })
  })

  $(".columns").on("click", ".column-box", function(event) {
    $e = $(event.currentTarget);
    var column = $e.data("id");

    $(".box").each(function(index, box) {
      $box = $(box)

      if ($box.data("id")[1] == column) {
        $box.addClass("white");
      }

    })

    $(".box").each(function(index, box) {
      var random = (Math.floor(Math.random() * 30));

      $box = $(box);

      if ($box.data("id")[1] == column) {
        createTimer($box, index/4.0);
        if (random == 13) {
          console.log("FOUND 13");
          return false;
        }
      }
    })
  })


})