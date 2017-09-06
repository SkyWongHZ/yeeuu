window.onload = init;

function init() {

  var hotel = $(".project.hotel");
  var apartment = $(".project.apartment");

  var last_known_scroll_position = 0;
  var ticking = false;

  function showText(scroll_pos) {
    removeHideClass(scroll_pos, hotel);
    removeHideClass(scroll_pos, apartment);
  }

  function removeHideClass(scroll_pos, ele) {
    var textEle = ele.find(".text");
    if(ele.offset().top - $(window).innerHeight() + ele.height() / 4 * 3 <= scroll_pos && textEle.hasClass("hide")) {
      textEle.removeClass("hide");
    }
  }

  window.addEventListener('scroll', function(e) {
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
      window.setTimeout(function() {
        showText(last_known_scroll_position);
        ticking = false;
      });
    }
    ticking = true;
  });
    showText(window.scrollY);
}
