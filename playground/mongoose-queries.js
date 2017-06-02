const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

const {ObjectID} = require('mongodb');

var id = '592a05ca0dd8010d508c06e7';
var userId = '59276ca24eaf112720f3183f';

if(!ObjectID.isValid(userId)) {
  return console.log('Object ID is not valid');
}

// Todo.find({
//   _id: id
// }).then((todos) => {
//   if(todos.length === 0 ) {
//     return console.log('Object ID not found');
//   }
//   console.log('Todos', todos);
// }).catch((e) => console.log(e));
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   if(!todo) {
//     return console.log('Object ID not found');
//   }
//   console.log('Todo', todo);
// }).catch((e) => console.log(e));
//
// Todo.findById(id).then((todos) => {
//   if(!todos) {
//     return console.log('Object ID not found');
//   }
//   console.log('Todo by Id', todos);
// }).catch((e) => console.log(e));

Users.find({
  _id: userId
}).then((users) => {
  if(users.length === 0) {
    return console.log ('User Id not found!');
  }
  console.log('Users', users);
}).catch((e) => console.log(e));

Users.findOne({
  _id: userId
}).then((user) => {
  if(!user) {
    return console.log ('User Id not found!');
  }
  console.log('User', user);
}).catch((e) => console.log(e));

Users.findById(userId).then((users) => {
  if(!users) {
    return console.log ('User Id not found!');
  }
  console.log('Users by Id', users);
}).catch((e) => console.log(e));
