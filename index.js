const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// middlewar-----------------
app.use(cors())
// middlewar-----------------



// convart sending data to json-----------
app.use(express.json())
// convert sending data to json--------




// mongodb connection-------------------------

/*
user:  ema-jhon
password:  q3QHaE5MlYBm89dG
*/

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gkhtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// mongo db connection-------------------------
console.log(uri);
async function run() {
    try {
        await client.connect();
        console.log('database connected successfull...');
        const database = client.db('onlineShop');
        const productCollection = database.collection('products')
        
        
        //GET PRODUCTS API
        app.get('/products', async (req, res) => {
            console.log(req.query);
            const cursor = productCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const count = await cursor.count();
            let products;
            if (page) {
                products = await cursor.skip(page*size).limit(size).toArray()
            }
            else {
                products = await cursor.toArray();
            }
            
            
            res.send({
                count,
                products
            });

            // use POST api
            app.post('/products/byKeys', async (req, res) => {
                console.log(req.body);
                const keys = req.body;
                const query = { key: { $in: keys } };
                const users = await productCollection.find(query).toArray();
                res.json(products)
            })
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);













app.get('/', (req, res) => {
    res.send('server is running...')
})

app.listen(port, () => {
    console.log('server running on port',port);
})