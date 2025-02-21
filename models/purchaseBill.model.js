const { Schema, model, default: mongoose } = require("mongoose");

let purchase_product = new Schema(
    {
        billNo: {
            type: String,
            require: true,
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "vendor",
        },
        productId: {
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
        billDate: {
            type: Date,
            default: Date.now,
        },
        userId: { type: Schema.Types.ObjectId, ref: "user" },
    },
    /* 
    {
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        vendorId: { type: Schema.Types.ObjectId, ref: "vendor" },
        billNo: { type: String, required: true, },
        billDate: { type: Date.now },
        GSTPer: { type: Number, default: 0 },
        GSTAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 },
        isGSTBill: { type: Boolean, default: true }
        remarks: { type: String, default: "" },
    } 
    */
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("purchase_product", purchase_product, "purchase_product");
