const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server')
  }
  console.log('Connected to mongoDB server successfully.');
  // db.collection('Todos').insertOne({
  //   text: "Something to do",
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });
  db.collection('Users').insertOne({
    name: "Anand Apte",
    age: 35,
    location: "Melbourne"
  }, (err, result) => {
    if(err) {
      return console.log('Unable to insert Users', err);
    }
    console.log(JSON.stringify(result.ops, undefined,2));
  })
    db.close();
});
