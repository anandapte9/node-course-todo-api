const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

var password = '123password';

bcrypt.genSalt(10,(err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
})

var hashedPassword = '$2a$10$Ahu6KM1MUdx9sHKVFcpiaeRuZ29m/X7mYxucLF8jlPj3a7oTc3CH6';
bcrypt.compare('123password', hashedPassword, (err, res) => {
  console.log(res);
})
// var message = 'Main tera hero!';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hashed Message: ${hash}`);
