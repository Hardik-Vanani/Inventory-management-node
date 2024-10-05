const { Schema, model } = require("mongoose");

let user_schema = new Schema(
    {
        email:{
            type: String,
            require: true,
            unique: true,
        },
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
        timestamps: true,
    }
);

module.exports = model("users", user_schema, "users");
