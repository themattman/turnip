$(function() {
  $('#password').focus(function(){
    $('#password').keypress(function(k){
      if(k.keyCode == 13){
        console.log('succc');
        $.post('/start', { password: $('#password').val() });
      }
    });
  });

  // Toggle functionality on the graph selectors
  $('.btn-group').button();
});