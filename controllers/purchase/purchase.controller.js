const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    /* Get Purchase Bill API */
    getPurchase: async (req, res) => {
        try {
            const filter = req.params.id ? { _id: req.params.id, user_id: req.user.id } : { ...req.query, user_id: req.user.id };
            const purchaseData = await DB.purchase
                .find(filter)
                .populate({ path: "vendorDetail", select: "-user_id -createdAt -updatedAt" })
                .populate({ path: "productDetail", select: "-user_id -createdAt -updatedAt" })
                .select("-createdAt -updatedAt -user_id");
            return response.OK({ res, count: purchaseData.length, payload: { purchaseData } });
        } catch (error) {
            console.error("Error getting purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create Purchase Bill API */
    createPurchase: async (req, res) => {
        try {
            const { bill_no, vendorDetail, productDetail, qty, price, date } = req.body;

            const user_id = req.user.id;
            const vendorData = await DB.vendor.findOne({ _id: vendorDetail, user_id });
            const productData = await DB.product.findOne({ _id: productDetail, user_id });

            if (!vendorData || !productData) return response.NOT_FOUND({ res });

            // Update stock in product
            await DB.product.findByIdAndUpdate(
                productDetail,
                {
                    $inc: { stock: qty },
                },
                { new: true }
            );

            const amount = qty * price;
            const createPurchase = await DB.purchase.create({ ...req.body, amount, user_id });

            // Create transaction report
            await DB.report.create({
                productID: productDetail,
                transaction_type: "Purchase",
                transactionId: createPurchase._id,
                vendorID: vendorDetail,
                qty,
                price,
                amount,
                transaction_date: date,
                user_id,
            });

            return response.CREATED({ res, payload: { createPurchase } });
        } catch (error) {
            console.error("Error creating purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update Purchase Bill API */
    updatePurchase: async (req, res) => {
        try {
            const { bill_no, vendorDetail, productDetail, qty, price, date } = req.body;

            const user_id = req.user.id;

            const vendorData = await DB.vendor.findOne({ _id: vendorDetail, user_id }).select("-createdAt -updatedAt");
            const productData = await DB.product.findOne({ _id: productDetail, user_id }).select("-createdAt -updatedAt");
            const oldPurchase = await DB.purchase.findById(req.params.id).select("-user_id -createdAt -updatedAt");

            if (!vendorData || !productData || !oldPurchase) return response.NOT_FOUND({ res });

            // Update stock in product
            let qtyDifference = qty - oldPurchase.qty;
            await DB.product.findByIdAndUpdate(
                productDetail,
                {
                    $inc: { stock: qtyDifference },
                },
                { new: true }
            );

            // Update Purchase Bill
            const updateProduct = await DB.purchase.findByIdAndUpdate(
                {
                    _id: req.params.id,
                    user_id,
                },
                {
                    ...req.body,
                    amount: qty * price,
                },
                { new: true }
            );

            // Update transaction report
            await DB.report.findOneAndUpdate(
                { transactionId: req.params.id },
                {
                    vendorID: vendorDetail,
                    productID: productDetail,
                    qty,
                    price,
                    amount: qty * price,
                    transaction_date: date,
                },
                { new: true }
            );

            return response.OK({ res, payload: { updateProduct } });
        } catch (error) {
            console.error("Error updating purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete Purchase Bill API */
    deletePurchase: async (req, res) => {
        try {
            const findPurchase = await DB.purchase.findById(req.params.id);
            if (!findPurchase) return response.NOT_FOUND({ res });

            const productData = await DB.product.findById(findPurchase.productDetail);

            if (productData.stock <= findPurchase.qty) {
                return response.NO_ENOUGH_STOCK({ res });
            }

            // Update stock in product
            const newStock = productData.stock - findPurchase.qty;
            await DB.product.findByIdAndUpdate(findPurchase.productDetail, { stock: newStock }, { new: true });

            const deletePurchase = await DB.purchase.findByIdAndDelete({
                _id: req.params.id,
                user_id: req.user.id,
            });
            return response.OK({ res, payload: { deletePurchase } });
        } catch (error) {
            console.error("Error deleting purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
