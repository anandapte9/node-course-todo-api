const {SHA256} = require('crypto-js');

var message = 'Main tera hero!';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hashed Message: ${hash}`);
