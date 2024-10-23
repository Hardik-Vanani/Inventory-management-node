const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    /* Get Sale Bill API */
    getSale: async (req, res) => {
        try {
            const filter = req.params.id
                ? {
                      _id: req.params.id,
                      user_id: req.user.id,
                  }
                : {
                      ...req.query,
                      user_id: req.user.id,
                  };

            const saleData = await DB.sale
                .find(filter)
                .populate({
                    path: "customerDetail",
                    select: "-user_id -createdAt -updatedAt",
                })
                .populate({ path: "productDetail", select: " -user_id -createdAt -updatedAt" })
                .select("-user_id -createdAt -updatedAt");

            return response.OK({ res, count: saleData.length, payload: { saleData } });
        } catch (error) {
            console.error("Error getting sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create Sale Bill API */
    createSale: async (req, res) => {
        try {
            const { customerDetail, productDetail, qty, price, date } = req.body;

            const user_id = req.user.id;
            const customerData = await DB.customer.findOne({ _id: customerDetail, user_id });
            const productData = await DB.product.findOne({ _id: productDetail, user_id });

            if (!customerData || !productData) return response.NOT_FOUND({ res });

            if (qty > productData.stock) {
                return response.NO_ENOUGH_STOCK({ res });
            }

            // Update stock in product
            await DB.product.findByIdAndUpdate(
                productDetail,
                {
                    $inc: { stock: -qty },
                },
                { new: true }
            );

            const amount = qty * price;
            const saleData = await DB.sale.create({ ...req.body, amount, user_id });

            // Create trasaction report
            await DB.report.create({
                productID: productDetail,
                transaction_type: "Sale",
                transactionId: saleData._id,
                customerID: customerDetail,
                qty,
                price,
                amount,
                transaction_date: date,
                user_id,
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
            const { customerDetail, productDetail, qty, price, date } = req.body;

            const user_id = req.user.id;

            const customerData = await DB.customer.findOne({ _id: customerDetail, user_id });
            const productData = await DB.product.findOne({ _id: productDetail, user_id });
            if (!productData || !customerData) return response.NOT_FOUND({ res });

            if (qty > productData.stock) {
                return response.NO_ENOUGH_STOCK({ res });
            }

            const oldSale = await DB.sale.findById(req.params.id);
            if (!oldSale) return response.NOT_FOUND({ res });

            // Update stock in product
            const qtyDifference = qty - oldSale.qty;
            await DB.product.findByIdAndUpdate(
                productDetail,
                {
                    $inc: { stock: -qtyDifference },
                },
                { new: true }
            );

            const updateSale = await DB.sale.findByIdAndUpdate(
                { _id: req.params.id, user_id },
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
                    customerID: customerDetail,
                    productID: productDetail,
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
                findSale.productDetail,
                {
                    $inc: { stock: findSale.qty },
                },
                { new: true }
            );

            const deleteSale = await DB.sale.findByIdAndDelete({
                _id: req.params.id,
                user_id: req.user.id,
            });
            return response.OK({ res, payload: { deleteSale } });
        } catch (error) {
            console.error("Error deleting sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
