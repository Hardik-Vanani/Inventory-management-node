const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        customerName: String,
        mobileNo: {
            type: Number,
            maxlength: 10,
            required: true,
        },
        user_id: String,
    },
    {
        versionKey: false,
    }
);

module.exports = model("customer", schema, "customer");
