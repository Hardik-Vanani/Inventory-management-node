const mongoose = require("mongoose");

let user_schema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            require: true,
        },
        password: {
            type: String,
            require: true,
        },
    },
    {
        versionKey: false,
    }
);

module.exports = mongoose.model("users", user_schema, "users");
