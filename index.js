const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hepooac.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const brandCollection = client.db('productDB').collection('brands')
    const productCollection = client.db('productDB').collection('product')
    const cartsCollection = client.db('productDB').collection('carts')


    app.get('/brands', async(req , res) => {
        const cursor = brandCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/brands', async(req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await brandCollection.insertOne(newProduct)
      res.send(result);
  })


    app.get('/product', async(req , res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // show product brands base
    app.get('/product/:brandName', async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brand: brandName }
      const result = await productCollection.find(query).toArray();
      res.send(result);
  })


    // show singleProduct detail brands base
    app.get('/singleProduct/:_id', async (req, res) => {
      const id = req.params._id;
      const query = { _id: new ObjectId(id)  }
      const result = await productCollection.findOne(query);
      res.send(result);
  })



  // // update product
  app.put('/singleProduct/:_id', async (req, res) => {
    const id = req.params._id;
    const filter = { _id: new ObjectId(id)  }
    const updated = req.body;
    const update = {
      $set: {
        name: updated.name, 
        brand: updated.brand, 
        type: updated.type, 
        price: updated.price, 
        description: updated.description, 
        image: updated.image, 
        rating: updated.rating
      }
    }
    const result = await productCollection.updateOne(filter,update)
    res.send(result)
  })


  // carts
  app.post('/carts', async(req, res) => {
    const newCarts = req.body;
    console.log(newCarts);
    const result = await cartsCollection.insertOne(newCarts)
    res.send(result);
})



  app.get('/carts', async(req , res) => {
    const cursor = cartsCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})


// match cart email
app.get('/carts/:email', async (req, res) => {
  const email = req.params.email;
  const query = { userEmail: email }
  const result = await cartsCollection.find(query).toArray();
  res.send(result);
})

// delete method
app.delete('/carts/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartsCollection.deleteOne(query);
  res.send(result);
})



    app.post('/product', async(req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct)
        res.send(result);
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('TechFusion Server Running')
})

app.listen(port, () => {
    console.log(`TechFusion Server is running on PORT: ${port}`);
})