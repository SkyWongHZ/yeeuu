function validatePhone(phone) {
  if(phone.length != 11) {
    return false;
  }
  return /^1\d+$/.test(phone);
}

$(document).ready(function() {
    $('form.form button.submit-button').click(function(e) {
      e.preventDefault();
      var requiredInputs = $('form.form .required');
      $("form.form .required .notice").addClass("hide");
      var valid = true;
      for(var i = 0; i < requiredInputs.length ;i++) {
        var row = $(requiredInputs[i]);
        var input = row.find("input");
        var val = input.val();
        if(val == "") {
          row.find(".notice").removeClass("hide");
          valid = false;
        }
        if(input.attr("name") == "phone") {
          if(!validatePhone(val)) {
            row.find(".notice").removeClass("hide");
            valid = false;
          }
        }
      }
      // console.log(vals);
      if(!valid) {
        return;
      }
      $.get("/contact?" + $('form.form').serialize(), function() {
        var ele = $(".success");
        ele.removeClass("hide");
        document.getElementsByClassName('form')[0].reset();
        setTimeout(function(){
          ele.addClass("hide");
          $('form.form button.submit-button').prop("disabled", false);
        }, 3000);
      });
      $('form.form button.submit-button').prop("disabled", true);
    });
});
