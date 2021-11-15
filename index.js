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
      const reviewCollection = database.collection('review');

      // GET API

      // Manage Orders
      app.get('/orders', async (req, res) => {
         const cursor = orderCollection.find({});
         const orders = await cursor.toArray();
         res.send(orders);
      });

      // My Orders
      app.get('/myOrder/:email', async (req, res) => {
         const result = await orderCollection
            .find({ email: req.params.email })
            .toArray();
         res.json(result);
      });

      // make admin
      app.put('/users/admin', async (req, res) => {
         const user = req.body;
         const filter = { email: user.email };
         const updateDoc = { $set: { role: 'admin' } };
         const result = await usersCollection.updateOne(filter, updateDoc);
         res.json(result);
      });

      // Admin / not
      app.get('/users/:email', async (req, res) => {
         const email = req.params.email;
         const query = { email: email };
         const user = await usersCollection.findOne(query);
         let isAdmin = false;
         if (user?.role === 'admin') {
            isAdmin = true;
         }
         res.json({ admin: isAdmin });
      });

      // upsert
      app.put('/users', async (req, res) => {
         const user = req.body;
         const filter = { email: user?.email };
         const options = { upsert: true };
         const updateDoc = { $set: user };
         const result = await usersCollection.updateOne(
            filter,
            updateDoc,
            options
         );
         res.json(result);
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
      // Get Reviews
      app.get('/reviews', async (req, res) => {
         const cursor = reviewCollection.find({});
         const reviews = await cursor.toArray();
         res.send(reviews);
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
      // display watch
      app.get('/displayWatches', async (req, res) => {
         const result = await watchesCollection.find({}).limit(6).toArray();
         res.json(result);
      });

      // Orders API
      app.post('/orders', async (req, res) => {
         const order = req.body;
         const result = await orderCollection.insertOne(order);
         res.json(result);
      });

      // Reviews
      app.post('/addReview', async (req, res) => {
         const review = req.body;
         const result = await reviewCollection.insertOne(review);
         res.json(result);
      });

      // save users
      app.post('/users', async (req, res) => {
         const user = req.body;
         const result = await usersCollection.insertOne(user);
         res.json(result);
      });
      // cancel/delete order
      app.delete('/deleteOrder/:id', async (req, res) => {
         const id = req.params.id;
         const item = { _id: ObjectId(id) };
         const result = await orderCollection.deleteOne(item);
         res.json(result.acknowledged);
         // console.log(result);
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
