const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = 5055;


app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4oyrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection error", err)
  const productCollection = client.db("freshValley").collection("products");
  
  app.post('/addProduct', (req, res) => {
     const newProduct = req.body;
     console.log('adding new event', newProduct);
     productCollection.insertOne(newProduct)
     .then(result => {
          console.log('inserted ', result.insertedId);
          res.send(result.insertedId > 0)
     })
  })

  client.close();
});

app.listen(process.env.PORT || port)