const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {Users} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
    });
  });

  it('should not create invalid data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      })
  })
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return a todo doc', (done) => {
    request(app)
       .get(`/todos/${todos[0]._id.toHexString()}`)
       .expect(200)
       .expect((res) => {
         expect(res.body.todos.text).toBe(todos[0].text);
       })
       .end(done);
  })
  it('should return a 404 for Ids not found', (done) => {
    testId = new ObjectID();
    request(app)
      .get(`/todos/${testId.toHexString()}`)
      .expect(404)
      .end(done);
  })
  it('should return a 404 for Invlid Object IDs', (done) => {
    testId = new ObjectID();
    testId = testId.toHexString() + '123'
    request(app)
      .get(`/todos/${testId}`)
      .expect(404)
      .end(done);
  })
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
       .delete(`/todos/${hexId}`)
       .expect(200)
       .expect((res) => {
         expect(res.body.todo._id).toBe(hexId);
       })
       .end((err, res) => {
         if(err) {
           return done(err);
         }
         Todo.findById(hexId).then((todos) => {
         expect(todos).toNotExist();
         done();
       }).catch((e) => done(e));
     });
  });

  it('should return 404 if todo is not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
       .delete(`/todos/${hexId}`)
       .expect(404)
       .end(done);
  });

  it('should return 404 if ObjectID is invalid', (done) => {
    request(app)
       .delete('/todos/abc123')
       .expect(404)
       .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var updateText = 'Test todo one - updated from server.test';
    request(app)
       .patch(`/todos/${hexId}`)
       .send({text: updateText, completed: true})
       .expect(200)
       .expect((res) => {
         expect(res.body.todo.text).toBe(updateText);
         expect(res.body.todo.completed).toBe(true);
         expect(res.body.todo.completedAt).toBeA('number');
       })
       .end((err, res) =>{
         if(err) {
           return done(err);
         }
         Todo.findById(hexId).then((todos) => {
           expect(todos.text).toBe(updateText);
           expect(todos.completed).toBe(true);
           expect(todos.completedAt).toBeA('number');
           done();
         }).catch((e) => done(e));
      });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var updateText = 'Test Todo Two - updated from server.test';
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: updateText, completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(updateText);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res) => {
        if(err) {
        return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(updateText);
          expect(todo.completed).toBe(false);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        var userHexId = users[0]._id;
        expect(res.body._id).toBe(userHexId);
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = 'pass#123';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
        Users.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request is invalid', (done) => {
    var email = '123';
    var password = '123';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email is in user', (done) => {
    request(app)
      .post('/users')
      .send({email: users[0].email, password: users[0].password})
      .expect(400)
      .end(done);
  });
});

describe ('POST /users/login', () => {
  it('should authenticate a user with valid username and password', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Users.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should deny login for a user with invalid password', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: 'test123'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Users.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should delete users token when logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Users.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});
