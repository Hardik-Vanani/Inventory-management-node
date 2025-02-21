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
        userId: { type: Schema.Types.ObjectId, ref: "user" },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("vendor", schema, "vendor");
