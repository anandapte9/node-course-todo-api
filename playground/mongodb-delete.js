const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server')
  }
  console.log('Connected to mongoDB server successfully.');
  // db.collection('Users').deleteMany({name: "Anand Apte"}).then((result) => {
  //   console.log(result);
  // })
  db.collection('Users').findOneAndDelete({
    _id: new ObjectID('592633e7e18a7d38f0078f0d')
  }).then((result) => {
    console.log(result);
  })
  db.close();
});
