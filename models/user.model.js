const { Schema, model } = require("mongoose");
const { USER_TYPE: { USER }, } = require("../json/enum.json");

let user_schema = new Schema(
    {
        email: {
            type: String,
            require: true,
        },
        username: {
            type: String,
            require: true,
        },
        password: {
            type: String,
            require: true,
        },
        otp: { type: String },
        otpExpiry: { type: Date },
        firstName: { type: String, },
        lastName: { type: String, },
        city: { type: String, },
        state: { type: String, },
        shopName: { type: String, },
        profileImage: { type: String, },
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
