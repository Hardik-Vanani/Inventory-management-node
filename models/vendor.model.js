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
        user_id: String,
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("vendor", schema, "vendor");
