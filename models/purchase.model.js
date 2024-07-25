const { Schema, model, default: mongoose } = require("mongoose");

let purchase_product = new Schema(
    {
        bill_no: {
            type: Number,
            require: true,
        },
        vendorDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "vendor",
        },
        productDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
        qty: {
            type: Number,
            require: true,
        },
        price: {
            type: Number,
            require: true,
        },
        amount: {
            type: Number,
            require: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        user_id: String,
    },
    {
        versionKey: false,
    }
);

module.exports = model("purchase_product", purchase_product, "purchase_product");
