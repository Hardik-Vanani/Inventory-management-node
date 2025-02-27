const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URL)
    .then(
        () => {
            // console.log("connection successful")
        }).catch((err => {
            console.log(err)
        }))