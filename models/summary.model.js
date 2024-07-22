const { trace } = require("console");
const { Schema, model, default: mongoose } = require("mongoose");

let summary = new Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    },
    transaction_type: String,
    vendorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor",
    },
    customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
    },
    qty: Number,
    price: Number,
    amount: Number,
    transaction_date: {
        type: Date,
        default: Date.now,
    },
    user_id: String,
});

module.exports = model("summary", summary, "summary");