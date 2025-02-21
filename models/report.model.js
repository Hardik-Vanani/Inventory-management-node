const { Schema, model, default: mongoose } = require("mongoose");

let summary = new Schema(
    {
        productID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },

        transaction_type: String,
        transactionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "summary",
        },

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

        userId: { type: Schema.Types.ObjectId, ref: "user" },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("report", summary, "report");
