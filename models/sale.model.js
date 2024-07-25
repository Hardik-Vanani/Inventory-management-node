const { Schema, model, default: mongoose } = require("mongoose");

let sale_schema = new Schema(
    {
        bill_no: {
            type: Number,
            require: true,
        },
        customerDetail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "customer",
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

module.exports = model("sale_product", sale_schema, "sale_product");
