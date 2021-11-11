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
      const watchCollection = database.collection('exploreWatches');
      const featuredWatchCollection = database.collection('featuredWatches');
      const orderCollection = database.collection('orders');

      // GET API

      app.get('/exploreWatches', async (req, res) => {
         const cursor = watchCollection.find({});
         const exploreWatches = await cursor.toArray();
         res.send(exploreWatches);
      });
      app.get('/featuredWatches', async (req, res) => {
         const cursor = featuredWatchCollection.find({});
         const featuredWatches = await cursor.toArray();
         res.send(featuredWatches);
      });

      // Manage Orders
      app.get('/orders', async (req, res) => {
         const cursor = orderCollection.find({});
         const orders = await cursor.toArray();
         res.send(orders);
      });

      // My Orders
      app.get('/orders/:email', async (req, res) => {
         const cursor = orderCollection.find({});
         const orders = await cursor.toArray();
         res.send(orders);
      });

      // Get single service
      // app.get('/specialTours/:id', async (req, res) => {
      //    const id = req.params.id;
      //    console.log('getting special tour', id);
      //    const query = { _id: ObjectId(id) };
      //    const specialTour = await specialToursCollection.findOne(query);
      //    res.json(specialTour);
      // });

      // post API
      // app.post('specialTours', async (req, res) => {
      //    const specialTour = req.body;
      //    const result = await specialToursCollection.insertOne(specialTour);
      //    res.json(result);
      // });

      app.post('/exploreWatches', async (req, res) => {
         const exploreWatch = req.body;
         console.log('hit the post api', exploreWatch);

         const result = await watchCollection.insertOne(exploreWatch);
         console.log(result);

         res.json(result);
      });
      app.post('/featuredWatches', async (req, res) => {
         const featuredWatch = req.body;
         console.log('hit the post api', featuredWatch);

         const result = await watchCollection.insertOne(featuredWatch);
         console.log(result);

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
