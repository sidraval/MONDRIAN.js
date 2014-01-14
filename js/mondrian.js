Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function toggleColor($el, newColor) {
  $el.attr("class", "box");
  $el.addClass(newColor);
}

$(function() {
  for(var i = 0; i < 30; i++) {
    $(".columns").append("<div class='column-box' data-id='" + i + "'>" + (parseInt(i) + 1) + "</div>")
    $(".rows").append("<div class='column-box' data-id='" + i + "'>" + (parseInt(i) + 1) + "</div>")
    for(var j = 0; j < 30; j++) {
      $(".canvas").append("<div class='box' data-id='[" + i + "," + j + "]'></div>");
    }
  }

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

    $(".box").each(function(index, box) {
      $box = $(box);

      if ($box.data("id")[0] == column) {
        toggleColor($box, ["red", "blue", "yellow", "gray"].randomElement())
      }
    })
  })

  $(".columns").on("click", ".column-box", function(event) {
    $e = $(event.currentTarget);
    var column = $e.data("id");

    console.log(column);

    $(".box").each(function(index, box) {
      $box = $(box);

      if ($box.data("id")[1] == column) {
        toggleColor($box, ["red", "blue", "yellow", "gray"].randomElement())
      }
    })
  })
})