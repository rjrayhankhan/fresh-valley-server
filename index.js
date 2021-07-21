const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;

const port = 5055;


app.use(cors());
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('Hello World!, This is Fresh Valley')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4oyrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error", err)
  const productCollection = client.db("freshValley").collection("products");
  const userCollection = client.db("freshValley").collection("userData");


  app.get('/products', (req, res) => {
      productCollection.find()
      .toArray((err, items) => {
        console.log('from database', items)
         res.send(items)
      })
  })

  // app.get('/product/:id', (req, res) => {
  //     productCollection.find({_id: req.query.id})
  //     .toArray((err, items) => {
  //       console.log('from database', items, err)
  //        res.send(items)
  //     }) 
  // }) 


  app.post('/addProduct', (req, res) => {
     const newProduct = req.body;
     console.log('adding new event', newProduct);
     productCollection.insertOne(newProduct)
     .then(result => {
          console.log('inserted ', result.insertedId);
          res.send(result.insertedId > 0)
     })
  })


  app.post('/userOrder', (req, res) => {
     const userData = req.body;
     console.log('adding new event', userData);
     userCollection.insertOne(userData)
     .then(result => {
          console.log('inserted ', result.insertedId);
          res.send(result.insertedId > 0)
     })
  })

  app.get('/userOrders', (req, res) => {
      userCollection.find({email: req.query.email})
      .toArray((err, items) => {
          res.send(items)
      })
  })

  app.delete('deleteEvent/:id', (req, res) => {
     const id = ObjectID(req.params.id);
     console.log('delete this event', id)
     productCollection.findOneAndDelete({_id: id})
     .then(document => res.send(document))
  })

  // client.close();
});

app.listen(process.env.PORT || port)