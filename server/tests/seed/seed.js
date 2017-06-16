const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {Users} = require('./../../models/user');

const userOneId = new ObjectID().toHexString();
const userTwoId = new ObjectID().toHexString();

const users = [{
  _id: userOneId,
  email: 'anandapte9@gmail.com',
  password: 'testpass123',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userOneId, access:'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId,
  email: 'anandapte09@gmail.com',
  password: 'testpass1234'
}]

const todos = [{
  _id: new ObjectID(),
  text: 'Test Todo One'
},{
  _id: new ObjectID(),
  text: 'Test Todo Two',
  completed: true,
  completedAt: 123
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  Users.remove({}).then(() => {
    var userOne = new Users(users[0]).save();
    var userTwo = new Users(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
