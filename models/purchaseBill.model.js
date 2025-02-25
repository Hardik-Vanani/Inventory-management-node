const { Schema, model, default: mongoose } = require("mongoose");

let purchaseBill = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        vendorId: { type: Schema.Types.ObjectId, ref: "vendor" },
        billNo: { type: String, required: true, },
        billDate: { type: Date },
        GSTPercentage: { type: Number, default: 0 },
        GSTAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 },
        finalAmount: { type: Number, default: 0 },
        isGSTBill: { type: Boolean, default: true },
        remarks: { type: String, default: "" },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("purchaseBill", purchaseBill, "purchaseBill");
