require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const uri=process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(uri);
var id=0;

const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const port = 8080;
const filename = __dirname + "/profs.json";

/*let collection

async function main(){
    await client.connect()
    const database = client.db("ratings");
    const collection = database.collection("profrating");
}
main()*/

//Middleware
app.use(express.json()); //for parsing application/json
app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);
//Endpoints
app.get("/profs", async function (req, res) {
    try{
        await client.connect()
        const database = client.db("ratings");
        const collection = database.collection("profrating");
        const results = await collection.find().sort({id:1}).toArray();
        const myArray = results.map((document) => document);
        res.end(JSON.stringify(myArray))
        await client.close()
    }catch{
        res.status=500
    }
});
/*app.get("/profs/:id", async function (req, res) {
    try{
        const rating={
            id: req.params.id
        }

        const ratings = await collection.find(rating).sort({id:1}).toArray();
        res.end(JSON.stringify(ratings));
    }catch{
        res.status=500
    }
});*/
app.put("/profs/:id", async function (req, res) {
    try {
        await client.connect()
        const database = client.db("ratings");
        const collection = database.collection("profrating");
        const reqid = parseInt(req.params.id);
        const filter = { id: reqid}
        const option = { upsert: false}
        const updateDoc = {
            $set: {
                rating: parseInt(req.body.rating),
                name: req.body.name
            },
        };
        const result  = await collection.updateOne(filter,updateDoc,option)
        const retString = await collection.find().sort({id:1}).toArray();
        const retData = JSON.stringify(retString)
        res.end(retData)
    } catch {
        res.status=500;
    }

});
app.delete("/profs/:id",async function (req, res) {
    try {
        await client.connect()
        const database = client.db("ratings");
        const collection = database.collection("profrating");
        const doc = {
            id: parseInt(req.params.id),
        };
        const result = await collection.deleteMany(doc);
        const results = await collection.find().sort({id:1}).toArray();
        const myArray = results.map((document) => document);
        res.end(JSON.stringify(myArray))
        if(JSON.stringify(myArray)=="[]"){
            id=0;
        }
    }catch{
        res.status=500
    }
});
app.post("/profs", async function (req, res) {
    try{
        await client.connect()
        const database = client.db("ratings");
        const collection = database.collection("profrating");
        const doc={
            id: id,
            name: req.body.name,
            rating: req.body.rating,
        }
        id++;
        const result = await collection.insertOne(doc);
        const results = await collection.find().sort({id:1}).toArray();
        const myArray = results.map((document) => document);
        res.end(JSON.stringify(myArray))
    }catch{
        res.status=500
    }
});
app.delete("/profs", async function (req, res) {
    try {
        await client.connect()
        const database = client.db("ratings");
        const collection = database.collection("profrating");
        const result = await collection.deleteMany({});
        res.end(JSON.stringify("[]"))
        id=0
    }catch{
        res.status=500
    }
});
app.listen(port, () => console.log(`Server listening on port ${port}!`));
