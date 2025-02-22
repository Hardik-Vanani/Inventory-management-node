const { Schema, model } = require("mongoose")

const incomeSchema = new Schema(
    {
        incomeName: { type: String, require: true },
        supplierName: { type: String },
        paymentMode: { type: String, require: true },
        amount: { type: Number },
        userId: { type: Schema.Types.ObjectId, ref: "user" },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("income", incomeSchema, "income")