const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const port = 8080;
const filename = __dirname + "/profs.json";
//Middleware
app.use(express.json()); //for parsing application/json
app.use(cors()); //for configuring Cross-Origin Resource Sharing (CORS)
function log(req, res, next) {
    console.log(req.method + " Request at" + req.url);
    next();
}
app.use(log);
//Endpoints
app.get("/profs", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(data);
    });
});
app.get("/profs/:id", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        const dataAsObject = JSON.parse(data)[req.params.id];
        res.writeHead(200, {
            "Content-Type": "application/json",
        });
        res.end(JSON.stringify(dataAsObject));
    });
});
app.put("/profs/:id", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject[req.params.id].name = req.body.name;
        dataAsObject[req.params.id].rating = req.body.rating;
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });
});
app.delete("/profs/:id", async function (req, res) {

    try {
        await client.connect();
        // database and collection code goes here
        // delete code goes here
        // amount deleted code goes here
        // database and collection code goes here
        const db = client.db("ratings");
        const coll = db.collection("profratings");

        const doc = {
            id: req,
        };

        const result = await coll.deleteMany(doc);

        // amount deleted code goes here
        console.log("Number of documents deleted: " + result.deletedCount);

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    run().catch(console.dir);

    /*fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject.splice(req.params.id, 1);
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });*/
});


app.post("/profs", function (req, res) {
    fs.readFile(filename, "utf8", function (err, data) {
        let dataAsObject = JSON.parse(data);
        dataAsObject.push({
            id: dataAsObject.length,
            name: req.body.name,
            rating: req.body.rating,
        });
        fs.writeFile(filename, JSON.stringify(dataAsObject), () => {
            res.writeHead(200, {
                "Content-Type": "application/json",
            });
            res.end(JSON.stringify(dataAsObject));
        });
    });
});
app.delete("/profs", async function (req, res) {

    try {
        await client.connect();

        const db = client.db("ratings");
        const coll = db.collection("profratings");

        const result = await coll.deleteMany(doc);

        // amount deleted code goes here
        console.log("Number of documents deleted: " + result.deletedCount);

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
    run().catch(console.dir);

    /*fs.writeFile(filename, "[]", function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete records" });
        } else {
            res.status(200).json({ message: "All records deleted successfully" });
        }
    });*/
});
app.listen(port, () => console.log(`Server listening on port ${port}!`));
