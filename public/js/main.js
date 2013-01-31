$(function() {
	//console.log('test')
  $('#password').focus(function(){
    $('#password').keypress(function(k){
      console.log(k, 'fired!');
      console.log(k.keyCode);
      if(k.keyCode == 13){
        console.log('succc');
        $.post('/start', { password: $('#password').val() });
      }
    });
  });
});