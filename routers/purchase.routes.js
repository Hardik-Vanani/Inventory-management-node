const express = require("express");
const router = express.Router();
const purchase = require("../models/purchase.model");
const vendor = require("../models/vendor.model");
const product = require("../models/product.model");
const summary = require("../models/summary.model");
const auth = require("../middleware/auth.middleware");

const response = require("../helpers/response.helper");

router.get("/", auth, async (req, res) => {
    try {
        const user_id = req.user.id;
        const purchaseData = await purchase
            .find({ ...req.query, user_id })
            .populate({ path: "vendorDetail", select: "-__v -user_id" })
            .populate({ path: "productDetail", select: "-__v -user_id" })
            .select("-__v");
        return response.OK({ res, count: purchaseData.length, payload: { purchaseData } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});
router.post("/create", auth, async (req, res) => {
    try {
        const { bill_no, vendorDetail, productDetail, qty, price, date } = req.body;
        if (!bill_no || !vendorDetail || !productDetail || !qty || !price) return response.ALL_REQUIRED({ res });

        const user_id = req.user.id;
        const vendorData = await vendor.findOne({ _id: vendorDetail, user_id });
        if (!vendorData) return response.NOT_FOUND({ res });

        const productData = await product.findOne({ _id: productDetail, user_id });
        if (!productData) return response.NOT_FOUND({ res });

        // Update stock in product
        await product.findByIdAndUpdate(
            productDetail,
            {
                $inc: { stock: qty },
            },
            { new: true }
        );

        const amount = qty * price;
        const createPurchase = await purchase.create({ ...req.body, amount, user_id });

        // Create transaction summary
        await summary.create({
            productID: productDetail,
            transaction_type: "Purchase",
            vendorID: vendorDetail,
            qty,
            price,
            amount,
            transaction_date: date,
            user_id,
        });

        return response.CREATED({ res, payload: { createPurchase } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});
router.put("/update/:id", validateObjectId, auth, async (req, res) => {
    try {
        const { bill_no, vendorDetail, productDetail, qty, price, date } = req.body;
        if (!bill_no || !vendorDetail || !productDetail || !qty || !price) return response.ALL_REQUIRED({ res });

        const user_id = req.user.id;
        const vendorData = await vendor.findOne({ _id: vendorDetail, user_id });
        if (!vendorData) return response.NOT_FOUND({ res });

        const productData = await product.findOne({ _id: productDetail, user_id });
        if (!productData) return response.NOT_FOUND({ res });

        const oldPurchase = await purchase.findById(req.params.id);
        if (!oldPurchase) return response.NOT_FOUND({ res });

        // Update stock in product
        let qtyDifference = qty - oldPurchase.qty;
        await product.findByIdAndUpdate(
            productDetail,
            {
                $inc: { stock: qtyDifference },
            },
            { new: true }
        );

        const updateProduct = await purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return response.OK({ res, payload: { updateProduct } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});
router.delete("/delete/:id", validateObjectId, auth, async (req, res) => {
    try {
        const findPurchase = await purchase.findById(req.params.id);
        if (!findPurchase) return response.NOT_FOUND({ res });

        const productData = await product.findById(findPurchase.productDetail);

        if (productData.stock <= findPurchase.qty) {
            return response.NO_ENOUGH_STOCK({ res });
        }

        // Update stock in product
        const newStock = productData.stock - findPurchase.qty;
        await product.findByIdAndUpdate(findPurchase.productDetail, { stock: newStock }, { new: true });

        const user_id = req.user.id;
        const deletePurchase = await purchase.findByIdAndDelete({ _id: req.params.id, user_id });
        return response.OK({ res, payload: { deletePurchase } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

module.exports = router;
