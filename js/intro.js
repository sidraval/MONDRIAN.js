$(function() {
  $(".rowcol").hide();
  $(".clickanddrag").hide();

  $(".rowcol").fadeIn(800);

  setTimeout(function() {
    $(".clickanddrag").fadeIn(800);
  }, 400)

  $(".topbar").on("click", function(e) {
    $(this).parent().remove();
  });
})