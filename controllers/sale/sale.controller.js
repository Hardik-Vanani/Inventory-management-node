const response = require("../../helpers/response.helper");
const DB = require("../../models");
const {
    USER_TYPE: { ADMIN },
} = require("../../json/enum.json");

module.exports = {
    /* Get Sale Bill API */
    getSale: async (req, res) => {
        try {
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };

            const saleData = await DB.sale
                .find(filter)
                .populate({
                    path: "customerId",
                    select: "-userId -createdAt -updatedAt",
                })
                .populate({ path: "productId", select: " -userId -createdAt -updatedAt" })
                .select("-userId -createdAt -updatedAt");

            return response.OK({ res, count: saleData.length, payload: { saleData } });
        } catch (error) {
            console.error("Error getting sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create Sale Bill API */
    createSale: async (req, res) => {
        try {
            const { customerId, productId, qty, price, date } = req.body;

            const userId = req.user.id;
            const customerData = await DB.customer.findOne({ _id: customerId, userId });
            const productData = await DB.product.findOne({ _id: productId, userId });

            if (!customerData || !productData) return response.NOT_FOUND({ res });

            if (qty > productData.stock) {
                return response.NO_ENOUGH_STOCK({ res });
            }

            // Update stock in product
            await DB.product.findByIdAndUpdate(
                productId,
                {
                    $inc: { stock: -qty },
                },
                { new: true }
            );

            const amount = qty * price;
            const saleData = await DB.sale.create({ ...req.body, amount, userId });

            // Create trasaction report
            await DB.report.create({
                productID: productId,
                transaction_type: "Sale",
                transactionId: saleData._id,
                customerID: customerId,
                qty,
                price,
                amount,
                transaction_date: date,
                userId,
            });

            return response.CREATED({ res, payload: { saleData } });
        } catch (error) {
            console.error("Error creating sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update existed Sale Bill API */
    updateSale: async (req, res) => {
        try {
            const { customerId, productId, qty, price, date } = req.body;

            const userId = req.user.id;

            const customerData = await DB.customer.findOne({ _id: customerId, userId });
            const productData = await DB.product.findOne({ _id: productId, userId });
            if (!productData || !customerData) return response.NOT_FOUND({ res });

            if (qty > productData.stock) {
                return response.NO_ENOUGH_STOCK({ res });
            }

            const oldSale = await DB.sale.findById(req.params.id);
            if (!oldSale) return response.NOT_FOUND({ res });

            // Update stock in product
            const qtyDifference = qty - oldSale.qty;
            await DB.product.findByIdAndUpdate(
                productId,
                {
                    $inc: { stock: -qtyDifference },
                },
                { new: true }
            );

            // Update sale bill
            const updateSale = await DB.sale.findByIdAndUpdate(
                { _id: req.params.id, userId },
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
                    customerID: customerId,
                    productID: productId,
                    qty,
                    price,
                    amount: qty * price,
                    transaction_date: date,
                },
                { new: true }
            );

            return response.OK({ res, payload: { updateSale } });
        } catch (error) {
            console.error("Error updating sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete Sale Bill API */
    deleteSale: async (req, res) => {
        try {
            const findSale = await DB.sale.findById(req.params.id);
            if (!findSale) return response.NOT_FOUND({ res });

            // Update stock in product
            await DB.product.findByIdAndUpdate(
                findSale.productId,
                {
                    $inc: { stock: findSale.qty },
                },
                { new: true }
            );

            const deleteSale = await DB.sale.findByIdAndDelete({
                _id: req.params.id,
                userId: req.user.id,
            });
            return response.OK({ res, payload: { deleteSale } });
        } catch (error) {
            console.error("Error deleting sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
