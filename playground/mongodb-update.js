const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server')
  }
  console.log('Connected to mongoDB server successfully.');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('592681302c52973ec7f57c16')
  // },{
  //   $set: {
  //     complete: true
  //   }
  // },{
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })
  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59267dbb2c52973ec7f57b33')
  },{
    $set: {
      name: "Vaidehi Anand Apte"
    }, $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
}).then((result) => {
  console.log(result);
})

  db.close();
});
