const { Schema, model } = require("mongoose");
const {
    USER_TYPE: { USER },
} = require("../json/message.json");

let user_schema = new Schema(
    {
        email: {
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
        role: {
            type: String,
            default: USER,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("users", user_schema, "users");
