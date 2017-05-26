var mongoose = require('mongoose');

var Users = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minLength: 1,
    trim: true

  },
  password: {
    type: String,
    required: true,
    minLength: 1
  }
});

module.exports = {
  Users
};
