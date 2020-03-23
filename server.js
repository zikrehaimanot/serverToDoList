const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://demo:demo@list-o9pjo.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "list";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('taskcollection').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('todo.ejs', {tasksArray: result})
  })
})
//
app.post('/toDoList', (req, res) => {
  db.collection('taskcollection').save({
    task: req.body.task,
    completed: "incomplete",
  
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/update', (req, res) => {
  db.collection('taskcollection')
  .findOneAndUpdate({task: req.body.task}, {
    $set: {
      completed:"complete",


    }
  }, {
    sort: {_id: -1},
    upsert: false
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/remove', (req, res) => {
  db.collection('taskcollection').findOneAndDelete({task: req.body.task}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
