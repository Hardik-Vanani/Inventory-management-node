const { Schema, model } = require("mongoose")

let saleItemSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        productId: { type: Schema.Types.ObjectId, ref: "product" },
        saleBillId: { type: Schema.Types.ObjectId, ref: "saleBill" },
        customerId: { type: Schema.Types.ObjectId, ref: "customer" },
        qty: { type: Number, required: true },
        unit: { type: String, required: true },
        rate: { type: Number, required: true },
        GSTPercentage: { type: Number, default: 0 },
        GSTAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 }, // rate * qty
    },
    {
        versionKey: false,
        timestamps: true,
    }
)
module.exports = model("saleItem", saleItemSchema, "saleItem")