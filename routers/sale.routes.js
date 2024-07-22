const express = require("express");
const router = express.Router();
const sale = require("../models/sale.model");
const customer = require("../models/customer.model");
const product = require("../models/product.model");
const summary = require("../models/summary.model");
const { auth, validateObjectId } = require("../middleware/auth.middleware");

const response = require("../helpers/response.helper");

router.get("/", auth, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }

        const user_id = req.user.id;
        const saleData = await sale
            .find({ ...req.query, user_id })
            .populate({ path: "customerDetail", select: "-__v -user_id" })
            .populate({ path: "productDetail", select: "-__v -user_id" })
            .select("-__v");

        return response.OK({ res, count: saleData.length, payload: { saleData } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});
router.post("/create", auth, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }

        const { bill_no, customerDetail, productDetail, qty, price, date } = req.body;
        if (!bill_no || !customerDetail || !productDetail || !qty || !price) return response.ALL_REQUIRED({ res });

        const user_id = req.user.id;
        const customerData = await customer.findOne({ _id: customerDetail, user_id });
        if (!customerData) return response.NOT_FOUND({ res });

        const productData = await product.findOne({ _id: productDetail, user_id });
        if (!productData) return response.NOT_FOUND({ res });

        if (qty > productData.stock) {
            return response.NO_ENOUGH_STOCK({ res });
        }

        // Update stock in product 
        await product.findByIdAndUpdate(
            productDetail,
            {
                $inc: { stock: -qty },
            },
            { new: true }
        );

        const amount = qty * price;
        const saleData = await sale.create({ ...req.body, amount, user_id });

        // Create trasaction summary
        await summary.create({
            productID: productDetail,
            transaction_type: "Sale",
            customerID: customerDetail,
            qty,
            price,
            amount,
            transaction_date: date,
            user_id,
        });

        return response.CREATED({ res, payload: { saleData } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});
router.put("/update/:id", auth, validateObjectId, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }

        const { bill_no, customerDetail, productDetail, qty, price, date } = req.body;
        if (!bill_no || !customerDetail || !productDetail || !qty || !price) return response.ALL_REQUIRED({ res });

        const user_id = req.user.id;
        const customerData = await customer.findOne({ _id: customerDetail, user_id });
        if (!customerData) return response.NOT_FOUND({ res });

        const productData = await product.findOne({ _id: productDetail, user_id });
        if (!productData) return response.NOT_FOUND({ res });

        if (qty > productData.stock) {
            return response.NO_ENOUGH_STOCK({ res });
        }

        const oldSale = await sale.findById(req.params.id);
        if (!oldSale) return response.NOT_FOUND({ res });

        // Update stock in product 
        const qtyDifference = qty - oldSale.qty;
        await product.findByIdAndUpdate(
            productDetail,
            {
                $inc: { stock: -qtyDifference },
            },
            { new: true }
        );

        const updateSale = await sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return response.OK({ res, payload: { updateSale } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});
router.delete("/delete/:id", auth, validateObjectId, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }

        const findSale = await sale.findById(req.params.id);
        if (!findSale) return response.NOT_FOUND({ res });

        // Update stock in product 
        await product.findByIdAndUpdate(
            findSale.productDetail,
            {
                $inc: { stock: findSale.qty },
            },
            { new: true }
        );

        const deleteSale = await sale.findByIdAndDelete(req.params.id);
        return response.OK({ res, payload: { deleteSale } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

module.exports = router;
