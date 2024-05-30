const { Schema, model } = require("mongoose");

let productSchema = new Schema({
    productName: String,
    stock: {
        type: Number,
        default: 0,
    },
    user_id: String,
});

module.exports = model("product", productSchema, "product");
