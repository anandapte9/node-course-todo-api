const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var todos = [{
  _id: new ObjectID(),
  text: 'Test Todo One'
},{
  _id: new ObjectID(),
  text: 'Test Todo Two'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
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
         expect(res.body.todo.text).toBe(todos[1].text);
       })
       .end(done);
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
