const { Schema, model } = require("mongoose");
const { type } = require("os");

const schema = new Schema(
    {
        customerName: String,
        mobileNo: {
            type: String,
            required: true,
        },
        city: { type: String },
        state: { type: String },
        user_id: String,
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("customer", schema, "customer");
