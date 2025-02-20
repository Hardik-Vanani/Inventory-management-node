const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        vendorName: {
            type: String,
            required: true,
        },
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

module.exports = model("vendor", schema, "vendor");
