const { Schema, model, default: mongoose } = require("mongoose");

let summary = new Schema(
    {
        purchaseBillId: { type: Schema.Types.ObjectId, ref: "purchaseBill" },
        saleBillId: { type: Schema.Types.ObjectId, ref: "saleBill" },
        billNo: { type: String },
        billDate: { type: Date },

        vendorId: { type: Schema.Types.ObjectId, ref: "vendor", },
        customerId: { type: Schema.Types.ObjectId, ref: "customer", },

        amount: { type: Number, default: 0 },
        GSTPercentage: { type: Number, default: 0 },
        GSTAmount: { type: Number, default: 0 },
        taxableAmount: { type: Number, default: 0 },
        transaction_type: String,

        userId: { type: Schema.Types.ObjectId, ref: "user" },

    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("report", summary, "report");
