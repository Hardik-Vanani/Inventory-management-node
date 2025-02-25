const { Schema, model } = require("mongoose")

const expenseSchema = new Schema(
    {
        expenseName: { type: String, require: true },
        expenseDate: { type: Date },
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

module.exports = model("expense", expenseSchema, "expense")