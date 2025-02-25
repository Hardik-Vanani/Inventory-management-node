const { Schema, model, default: mongoose } = require("mongoose");

let sale_schema = new Schema(

    {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        customerId: { type: Schema.Types.ObjectId, ref: "customer" },
        billNo: { type: String, required: true, },
        billDate: { type: Date },
        GSTPercentage: { type: Number, default: 0 },
        GSTAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 },
        finalAmount: { type: Number, default: 0 },
        isGSTBill: { type: Boolean, default: true },
        remarks: { type: String, default: "" }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("saleBill", sale_schema, "saleBill");
