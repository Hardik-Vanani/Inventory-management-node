const { Schema, model } = require("mongoose");

let productSchema = new Schema(
    {
        productName: String,
        stock: {
            type: Number,
            default: 0,
        },
        unit: { type: String },
        hsnCode: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "user" },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("product", productSchema, "product");
