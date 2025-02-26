const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1/inventoryDB")
    .then(
        () => { 
            // console.log("connection successful")
         }).catch((err => {
        console.log(err)
    }))