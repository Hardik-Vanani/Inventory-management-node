const { Schema, model } = require("mongoose")

let purchaseItemSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "users" },
        productId: { type: Schema.Types.ObjectId, ref: "product" },
        purchaseBillId: { type: Schema.Types.ObjectId, ref: "purchaseBill" },
        vendorId: { type: Schema.Types.ObjectId, ref: "vendor" },
        qty: { type: Number, required: true },
        unit: { type: String, required: true },
        rate: { type: Number, required: true },
        GSTPercentage: { type: Number, default: 0 },
        GSTAmount: { type: Number, default: 0 },
        amount: { type: Number, default: 0 },
        totalAmount: { type: Number, default: 0 }, // rate * qty
    },
    {
        versionKey: false,
        timestamps: true,
    }
)
module.exports = model("purchaseItem", purchaseItemSchema, "purchaseItem")