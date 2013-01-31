$(function() {
	//console.log('test')
  $('#password').focus(function(){
    $('#password').keypress(function(k){
      console.log(k, 'fired!');
      if(k.keycode == 13){
        $.post('/start', { password: $('#password').val() });
      }
    });
  });
});