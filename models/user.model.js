const mongoose = require("mongoose");

let login_schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("login", login_schema);
