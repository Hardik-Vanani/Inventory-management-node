const { Schema, model } = require("mongoose")

const incomeSchema = new Schema(
    {
        incomeName: { type: String, require: true },
        incomeDate: { type: Date },
        supplierName: { type: String },
        paymentMode: { type: String, require: true },
        amount: { type: Number },
        note: { type: String },
        userId: { type: Schema.Types.ObjectId, ref: "users" },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = model("income", incomeSchema, "income")