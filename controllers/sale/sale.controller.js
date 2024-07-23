const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    getSale: async (req, res) => {
        try {
            const user_id = req.user.id;
            const saleData = await DB.sale
                .find({ ...req.query, user_id })
                .populate({ path: "customerDetail", select: "-__v -user_id" })
                .populate({ path: "productDetail", select: "-__v -user_id" })
                .select("-__v");

            return response.OK({ res, count: saleData.length, payload: { saleData } });
        } catch (error) {
            console.error(error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    createSale: async (req, res) => {
        try {
            const { bill_no, customerDetail, productDetail, qty, price, date } = req.body;

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

            // Create trasaction summary
            await DB.summary.create({
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
    },

    updateSale: async (req, res) => {
        try {
            const { bill_no, customerDetail, productDetail, qty, price, date } = req.body;

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

            const updateSale = await DB.sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return response.OK({ res, payload: { updateSale } });
        } catch (error) {
            console.error(error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

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

            const deleteSale = await DB.sale.findByIdAndDelete(req.params.id);
            return response.OK({ res, payload: { deleteSale } });
        } catch (error) {
            console.error(error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
