const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middle
const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucfjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // get api
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });

        // get single service
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // Post api 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("Hiting the service",service)
            const result = await servicesCollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result}`);
            res.json(result);
        });

        // delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running Genius Server")
});

app.get('/hello', (req, res) => {
    res.send("Hello updated here")
});

app.listen(port, () => {
    console.log('Running Genius Sever on port', port)
});

/* 
one time: 
1. heroku account open
2. Heroku software install
------------------------------------------------

Every project
1. git init
2. .gitignore (node_module, .env)
3. push everything to git 
4. make sure you have this script: "start": "node index.js"
5. make sure: put process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command:  git push heroku main
--------------------------------------------------

update:
1. save everything check locally
2. git add ., git commit-m"", git push
3. git push heroku main
*/