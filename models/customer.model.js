const { Schema, model } = require("mongoose");

const schema = new Schema(
    {
        customerName: String,
        mobileNo: { type: String, required: true, },
        city: { type: String },
        state: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("customer", schema, "customer");
