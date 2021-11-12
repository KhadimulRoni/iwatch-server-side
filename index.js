const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uanva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

async function run() {
   try {
      await client.connect();
      // console.log('connected to database');
      const database = client.db('iWatch');
      const watchesCollection = database.collection('Watches');
      const usersCollection = database.collection('users');
      const orderCollection = database.collection('orders');

      // GET API

      // Manage Orders
      app.get('/orders', async (req, res) => {
         const cursor = orderCollection.find({});
         const orders = await cursor.toArray();
         res.send(orders);
      });

      // My Orders
      app.get('/myOrder/:email', async (req, res) => {
         const cursor = orderCollection.find({});
         const orders = await cursor.toArray();
         res.send(orders);
      });

      // Get single service
      app.get('/singleWatch/:id', async (req, res) => {
         console.log(req.params.id);
         const result = await watchesCollection
            .find({ _id: ObjectId(req.params.id) })
            .toArray();
         res.json(result[0]);
         console.log(result);
      });

      // post API
      // addServices

      app.post('/addWatches', async (req, res) => {
         console.log(req.body);
         const result = await watchesCollection.insertOne(req.body);
         res.json(result);
      });

      // get all watches
      app.get('/allWatches', async (req, res) => {
         const result = await watchesCollection.find({}).toArray();
         res.json(result);
      });

      // Orders API
      app.post('/orders', async (req, res) => {
         const order = req.body;

         const result = await orderCollection.insertOne(order);
         res.json(result);
      });
   } finally {
      // await client.close();
   }
}

run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('running iWatch server');
});

app.listen(port, () => {
   console.log('running iWatch server on port', port);
});
