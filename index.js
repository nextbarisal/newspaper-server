const express = require('express');
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const app = express();

app.use(cors())
app.use(express.json())

const port = process.env.PORT | 5000;

const uri = "mongodb+srv://nbnext50:Nextb_0987@cluster0.g9qbt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('newspare');
        const newsCollection = database.collection('news');
        const internationalCollection = database.collection('international');
        const politicsCollection = database.collection('politics');
        const sportsCollection = database.collection('sports');

        // Get All News
        app.get('/news', async (req, res) => {
            const cursor = newsCollection.find({});
            const result = await cursor.toArray()
            res.json(result);
        })

        // Post News
        app.post('/news', async (req, res) => {
            const newPackage = req.body;
            const result = await newsCollection.insertOne(newPackage)
            res.json(result)
        })

        // Find News By ID
        app.get('/news/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)

            if (id.length === 24) {
                const query = { _id: ObjectId(id) }
                const result = await newsCollection.findOne(query)
                res.json(result)
            }
            else {
                const query = { category: id }
                const cursor = await newsCollection.find(query)
                const result = await cursor.toArray()
                res.json(result)
            }
        })

        // // Find News By Category
        // app.get('/news/:category', async (req, res) => {
        //     const category = req.params.category;
        //     const query = { category: category }
        //     const cursor = await newsCollection.find(query)
        //     const result = await cursor.toArray()
        //     res.json(result)
        // })

        // / Find News By Category
        // app.get('/news', async (req, res) => {
        //     const category = req.query.category;
        //     const query = { category: category }
        //     const cursor = await newsCollection.find(query)
        //     const result = await cursor.toArray()
        //     res.json(result)
        // })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Newspaper Server!')
})

app.listen(port, () => {
    console.log(`Newspaper app listening at`, port)
})