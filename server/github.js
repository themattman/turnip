var fs = require('fs');

var accounts = JSON.parse(fs.readFileSync('github.json', 'utf8'));
console.log(accounts);