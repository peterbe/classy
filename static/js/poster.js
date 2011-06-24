$(function() {
  $('form').submit(function() {
    var url, training = false;
    if ($('input[name="key"]').val()) {
      training = true;
      url = '/train/key/' + $('input[name="key"]').val();
      if ($('input[name="user"]').val())
        url += '/user/' + $('input[name="user"]').val();
    } else {
      url = '/guess';
      if ($('input[name="user"]').val())
        url += '/user/' + $('input[name="user"]').val();
    }
    text = $('textarea').val();
    $.post(url, {text: text}, function(response) {
      if (training) {
        if (response && !$('input[name="user"]').val()) {
          $('input[name="user"]').val(response);
        }
        $('textarea').val('');
        $('<span>', {text:'Awesomlicious!', id:'flash'})
          .insertAfter($('input[type="submit"]'));
        setTimeout(function() {
          $('#flash').fadeOut(700, function() {
            $('#flash').remove();
          });
        }, 1e3);
      } else {
        alert(response);
      }
    });
    return false;
  });

  $('textarea,input[name="key"]').change(function() {
    if ($('input[name="key"]').val()) {
      $('input[type="submit"]').val("Train!");
    } else {
      $('input[type="submit"]').val("Guess!");
    }
  });
});
