var fs = require('fs');

var accounts = JSON.parse(fs.readFileSync('github.json', 'utf8'));
console.log(accounts);

/*setInterval(function(){
  console.log('test');

  // Get the github data
  accounts.forEach(function(item){
    console.log(item);
  });
}, 10000);*/

