const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        vendorName: String,
        mobileNo: {
            type: String,
            maxlength: 10,
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
