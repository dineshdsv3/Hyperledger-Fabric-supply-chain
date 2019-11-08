var express = require('express');
var app = express();
const fbclient = require('./fabricClient.js')
var connection = fbclient

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req, res) => { res.send("Hello World") })
// Request to create a new fruit
app.post("/createFruit", (req, res) => {
    var data = req.body;

    return connection.initCredentialStores().then(() => {
        console.log("Successfully logged in")
        return connection.getUserContext('admin', true)
    }).then(() => {
        var request = {
            chaincodeId: "mycc",
            fcn: "createFruit",
            args: [data.id, data.name, data.quantity, data.owner],
            txId: connection.newTransactionID(),
            chainId: "mychannel"
        };
        console.log("Data taken")
        return connection.submitTransaction(request)
    }).then((data) => {
        console.log(data);
        res.send(data);
        // res.json({message:"successfully created fruit", data:data})
    }).catch((error) => {
        console.log("error is" + error);
        res.status(500).json({ message: "Error", error: error.message.toString() })
    })

    // res.json({message:"Welcome to Create Fruit page"})

})
// Request to change fruit's owner
app.post("/changeFruitOwner", (req, res) => {
    var data = req.body;

    return connection.initCredentialStores().then(() => {
        console.log("Successfully logged in to fruit owners change")
        return connection.getUserContext('admin', true)
    }).then(() => {
        var request = {
            chaincodeId: "mycc",
            fcn: "changeFruitOwner",
            args: [data.id, data.owner],
            txId: connection.newTransactionID(),
            chainId: "mychannel"
        };
        // console.log("Data taken")
        return connection.submitTransaction(request)
    }).then((data) => {
        console.log(data);
        res.json({ message: "Successfully Changed Owner", data: data })
        // res.send(data);
    }).catch((error) => {
        console.log("error is" + error);
        res.status(500).json({ message: "Error", error: error.message.toString() })
    })

})


// Request to change fruit's name
app.post("/changeFruitName", (req, res) => {
    var data = req.body;

    return connection.initCredentialStores().then(() => {
        console.log("Successfully logged in fruit name change")
        return connection.getUserContext('user1', true)
    }).then(() => {
        var request = {
            chaincodeId: "mycc",
            fcn: "changeFruitName",
            args: [data.id, data.name],
            txId: connection.newTransactionID(),
            chainId: "mychannel"
        };
        // console.log("Data taken")
        return connection.submitTransaction(request)
    }).then((data) => {
        console.log(data);
        res.json({ message: "successfully changed fruit name", data: data })
        // res.send(data);
    }).catch((error) => {
        console.log("error is" + error);
        res.status(500).json({ message: "Error", error: error.message.toString() })
    })

    // res.json({message:"Welcome to Create Fruit page"})

})
// Get request to get entire history of fruit
app.get("/getHistory/:fruit_id",(req,res) => {
    var fruitId = req.params.fruit_id;

    var requestData = {
        chaincodeId: "mycc",
        fcn: "getHistory",
        args: [fruitId]
    }
    return connection.initCredentialStores().then(() => {
        return connection.getUserContext('admin', true)
    }).then(() => {
        return connection.query(requestData)
    }).then((data) => {
        res.json({ message: "History of the selected fruit is", data: data })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({ message: "Error", error: error.message.toString() })
    })

})

// get request to query fruit
app.get("/queryFruit/:fruit_id", (req, res) => {

    var fruitId = req.params.fruit_id;

    var requestData = {
        chaincodeId: "mycc",
        fcn: "queryFruit",
        args: [fruitId]
    }

    return connection.initCredentialStores().then(() => {
        return connection.getUserContext('admin', true)
    }).then(() => {
        return connection.query(requestData)
    }).then((data) => {
        res.json({ message: "Successfully queries Fruit", data: data })
    }).catch((error) => {
        console.log(error)
        res.status(500).json({ message: "Error", error: error.message.toString() })
    })


    // res.json({message:"Welcome to Query Fruit"})

})


app.listen("3000", () => { console.log("Server started on port 3000") });