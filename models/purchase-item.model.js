const { Schema, model } = require("mongoose")

let purchaseItemSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        productId: { type: Schema.Types.ObjectId, ref: "product" },
        purchaseBillId: { type: Schema.Types.ObjectId, ref: "purchase_product" },
        vendorId: { type: Schema.Types.ObjectId, ref: "vendor" },
        hsnCode: { type: String, default: "" },
        qty: { type: Number, required: true },
        GSTPercentage: { type: Number, default: 0 },
        unit: { type: String, required: true },
        rate: { type: Number, required: true },
        totalAmount: { type: Number, default: 0 }, // rate * qty
    },
    {
        versionKey: false,
        timestamps: true,
    }
)
module.exports = model("saleItem", purchaseItemSchema, "saleItem")