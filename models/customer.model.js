const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        customerName: String,
        mobileNo: {
            type: String,
            required: true,
        },
        
        user_id: String,
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("customer", schema, "customer");
