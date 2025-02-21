const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN } } = require("../../json/enum.json");

module.exports = {
    /* Get Purchase Bill API */
    getPurchase: async (req, res) => {
        try {
            // Chekck if id is present in params
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };

            const purchaseData = await DB.purchase
                .find(filter)
                .populate({
                    path: "vendorId",
                    select: "-userId -createdAt -updatedAt",
                })
                .populate({ path: "productId", select: "-userId -createdAt -updatedAt" })
                .select("-userId -createdAt -updatedAt");

            return response.OK({ res, count: purchaseData.length, payload: { purchaseData } });
        } catch (error) {
            console.error("Error getting purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create Purchase Bill API */
    createPurchase: async (req, res) => {
        try {
            const { vendorId, productId, qty, price, date } = req.body;

            const userId = req.user.id;
            const vendorData = await DB.vendor.findOne({ _id: vendorId, userId });
            const productData = await DB.product.findOne({ _id: productId, userId });

            if (!vendorData || !productData) return response.NOT_FOUND({ res });

            // Update stock in product
            await DB.product.findByIdAndUpdate(
                productId,
                {
                    $inc: { stock: qty },
                },
                { new: true }
            );

            // Calculate amount
            const amount = qty * price;
            const createPurchase = await DB.purchase.create({ ...req.body, amount, userId });

            // Create transaction report
            await DB.report.create({
                productID: productId,
                transaction_type: "Purchase",
                transactionId: createPurchase._id,
                vendorID: vendorId,
                qty,
                price,
                amount,
                transaction_date: date,
                userId,
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
            const { vendorId, productId, qty, price, date } = req.body;

            const userId = req.user.id;

            // Find vendor, product and purchase data
            const vendorData = await DB.vendor.findOne({ _id: vendorId, userId }).select("-createdAt -updatedAt");
            const productData = await DB.product.findOne({ _id: productId, userId }).select("-createdAt -updatedAt");
            const oldPurchase = await DB.purchase.findById(req.params.id).select("-userId -createdAt -updatedAt");

            if (!vendorData || !productData || !oldPurchase) return response.NOT_FOUND({ res });

            // Update stock in product
            let qtyDifference = qty - oldPurchase.qty;
            await DB.product.findByIdAndUpdate(
                productId,
                {
                    $inc: { stock: qtyDifference },
                },
                { new: true }
            );

            // Update Purchase Bill
            const updateProduct = await DB.purchase.findByIdAndUpdate(
                {
                    _id: req.params.id,
                    userId,
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
                    vendorID: vendorId,
                    productID: productId,
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

            const productData = await DB.product.findById(findPurchase.productId);

            // Check stock for purchase
            if (productData.stock <= findPurchase.qty) {
                return response.NO_ENOUGH_STOCK({ res });
            }

            // Update stock in product
            const newStock = productData.stock - findPurchase.qty;
            await DB.product.findByIdAndUpdate(findPurchase.productId, { stock: newStock }, { new: true });

            const deletePurchase = await DB.purchase.findByIdAndDelete({
                _id: req.params.id,
                userId: req.user.id,
            });
            return response.OK({ res, payload: { deletePurchase } });
        } catch (error) {
            console.error("Error deleting purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
