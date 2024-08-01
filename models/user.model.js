const { Schema, model } = require("mongoose");

let user_schema = new Schema(
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
        timestamps: true,
    }
);

module.exports = model("users", user_schema, "users");
