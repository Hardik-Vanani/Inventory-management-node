const { Schema, model, default: mongoose } = require("mongoose");

let sale_schema = new Schema(
    {
        billNo: {
            type: Number,
            require: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "customer",
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
        date: {
            type: Date,
            default: Date.now,
        },
        userId: { type: Schema.Types.ObjectId, ref: "user" },
    },
    /* 
    {
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        customerId: { type: Schema.Types.ObjectId, ref: "customer" },
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

module.exports = model("sale_product", sale_schema, "sale_product");
