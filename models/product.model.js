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
        itemCode: { type: String },
        user_id: String,
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("product", productSchema, "product");
