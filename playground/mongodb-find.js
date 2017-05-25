const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server')
  }
  console.log('Connected to mongoDB server successfully.');

  // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(err) => {
  //   console.log('Cannot fetch Todos', err);
  // })
  db.collection('Users').find({name: "Rati%"}).toArray().then((docs) => {
    console.log(JSON.stringify(docs,undefined,2));
  },(err) => {
    console.log('Cannot fetch Users', err);
  })
    db.close();
});
