const { Schema, model } = require("mongoose")

let saleItemSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        productId: { type: Schema.Types.ObjectId, ref: "product" },
        saleBillId: { type: Schema.Types.ObjectId, ref: "saleBill" },
        customerId: { type: Schema.Types.ObjectId, ref: "customer" },
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
module.exports = model("saleItem", saleItemSchema, "saleItem")