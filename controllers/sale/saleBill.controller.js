const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN }, TRASANCTION_TYPE } = require("../../json/enum.json");
const messages = require("../../json/message.json")

module.exports = {
    /* Get Sale Bill API */
    getSale: async (req, res) => {
        try {
            // Check if id is present in params
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.params.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };

            // Fetch saleBill & saleItems with populated productId and customerId
            const saleBills = await DB.sale.find(filter)
                .populate("userId", "-password -otp -otpExpiry -role -createdAt -updatedAt")
                .populate("customerId", "-createdAt -updatedAt -userId")
                .sort({ createdAt: -1 })
                .lean();

            const saleBillIds = saleBills.map(bill => bill._id);

            const saleItems = await DB.saleItem.find({
                saleBillId: { $in: saleBillIds }
            })
                .populate("productId", "-createdAt -updatedAt -userId")
                .lean()
                .select("-createdAt -updatedAt -userId");

            // Group sale items by saleBillId
            const saleItemsMap = saleItems.reduce((acc, item) => {
                const billId = item.saleBillId.toString();
                if (!acc[billId]) acc[billId] = [];
                acc[billId].push(item);
                return acc;
            }, {});

            // Attach sale items to their respective sale bills
            const result = saleBills.map(bill => ({
                ...bill,
                saleItems: saleItemsMap[bill._id.toString()] || []
            }));

            return response.OK({ res, count: result.length, message: messages.SALE_FETCHED_SUCCESSFULLY, payload: { saleBills: result } });
        } catch (error) {
            console.error("Error getting sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create Sale Bill API */
    create: async (req, res) => {
        try {
            let { customerId, saleBillItems } = req.body
            userId = req.user.id
            if (!(await DB.customer.findOne({ _id: customerId, userId }))) return response.NOT_FOUND({ res, message: messages.CUSTOMER_NOT_FOUND });

            let insufficientStockProducts = [];
            let productUpdates = [];

            for (const item of saleBillItems) {
                const product = await DB.product.findOne({ _id: item.productId, userId });
                if (!product) {
                    return response.NOT_FOUND({ res, message: `Product with ID ${item.productId} not found` });
                }
                if (product.stock < item.qty) {
                    insufficientStockProducts.push({ productId: item.productId, productName: product.name, availableStock: product.stock });
                } else {
                    productUpdates.push({ productId: item.productId, qty: item.qty });
                }
            }

            if (insufficientStockProducts.length > 0) {
                return response.BAD_REQUEST({ res, message: `Stock is not enough for the following products: ${insufficientStockProducts.map(p => `${p.productName} (Available: ${p.availableStock})`).join(", ")}`, data: insufficientStockProducts });
            }
            // Create Purchase Bill
            const saleBill = await DB.sale.create({ ...req.body, userId });

            // Create Purchase Items
            const saleItems = saleBillItems.map(item => ({
                userId,
                productId: item.productId,
                saleBillId: saleBill._id,
                customerId,
                qty: item.qty,
                unit: item.unit,
                rate: item.rate,
                GSTPercentage: item.GSTPercentage,
                GSTAmount: item.GSTAmount,
                totalAmount: item.totalAmount,
            }));
            await DB.saleItem.insertMany(saleItems);

            // Update stock in product model
            for (const update of productUpdates) {
                await DB.product.findByIdAndUpdate(update.productId, { $inc: { stock: -update.qty } }, { new: true });
            }

            // Create transaction reports
            await DB.report.create({
                saleBillId: saleBill._id,
                billNo: saleBill.billNo,
                billDate: saleBill.billDate,
                customerId: customerId,
                amount: saleBill.totalAmount,
                GSTPercentage: saleBill.GSTPercentage,
                GSTAmount: saleBill.GSTAmount,
                taxableAmount: saleBill.finalAmount,
                transaction_type: TRASANCTION_TYPE.SALE,
                userId,
            });

            return response.CREATED({ res, message: messages.SALE_CREATED_SUCCESSFULLY, payload: { saleBill } })

        } catch (error) {
            console.error("Error getting sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },


    /* Update existed Sale Bill API */
    update: async (req, res) => {
        try {
            const { saleBillItems } = req.body;
            const userId = req.user.id;
            const saleBillId = req.params.id;

            // Check if sale bill exists
            const existingSaleBill = await DB.sale.findOne({ _id: saleBillId, userId });
            if (!existingSaleBill) return response.NOT_FOUND({ res, message: messages.SALE_NOT_FOUND });

            // Retrieve existing sale items to adjust stock
            const existingItems = await DB.saleItem.find({ saleBillId });

            // Restore old stock (increase stock since the sale is being updated)
            for (const item of existingItems) {
                await DB.product.findByIdAndUpdate(item.productId, { $inc: { stock: item.qty } }, { new: true });
            }

            // Delete existing sale items
            await DB.saleItem.deleteMany({ saleBillId });

            // Check all products existence
            let productUpdates = [];
            for (const item of saleBillItems) {
                const product = await DB.product.findOne({ _id: item.productId, userId });
                if (!product) {
                    return response.NOT_FOUND({ res, message: `Product with ID ${item.productId} not found` });
                }

                // Check if requested quantity is greater than available quantity
                if (item.qty > product.stock) {
                    // Minus stock to revert the above process
                    for (const item of existingItems) {
                        await DB.product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } }, { new: true });
                    }
                    return response.BAD_REQUEST({ res, message: `Insufficient stock for Product ID ${item.productId}. Available quantity: ${product.qty}` });
                }
                productUpdates.push({ productId: item.productId, qty: item.qty });
            }

            // Update Sale Bill
            await DB.sale.findByIdAndUpdate(saleBillId, { ...req.body }, { new: true });

            // Create new sale items
            const newSaleItems = saleBillItems.map(item => ({
                userId,
                productId: item.productId,
                saleBillId,
                customerId: existingSaleBill.customerId,
                qty: item.qty,
                unit: item.unit,
                rate: item.rate,
                GSTPercentage: item.GSTPercentage,
                GSTAmount: item.GSTAmount,
                amount: item.amount,
                totalAmount: item.totalAmount,
            }));
            await DB.saleItem.insertMany(newSaleItems);

            // Update stock in product model (decrease stock)
            for (const update of productUpdates) {
                await DB.product.findByIdAndUpdate(update.productId, { $inc: { stock: -update.qty } }, { new: true });
            }

            // Update report
            if (await DB.report.findOne({ saleBillId })) {
                await DB.report.findOneAndUpdate({ saleBillId }, {
                    billNo: req.body.billNo,
                    billDate: req.body.billDate,
                    amount: req.body.totalAmount,
                    GSTPercentage: req.body.GSTPercentage,
                    GSTAmount: req.body.GSTAmount,
                    taxableAmount: req.body.finalAmount,
                }, { new: true });
            }

            return response.OK({ res, message: messages.SALE_UPDATED_SUCCESSFULLY });
        } catch (error) {
            console.error("Error updating sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete Sale Bill API */
    delete: async (req, res) => {
        try {
            if (!(DB.sale.findOne(req.params.id))) return response.NOT_FOUND({ res, message: messages.SALE_NOT_FOUND });

            await DB.sale.findByIdAndDelete(req.params.id)
            await DB.saleItem.deleteMany({ saleBillId: req.params.id })
            await DB.report.deleteMany({ saleBillId: req.params.id })

            return response.OK({ res, message: messages.SALE_DELETED_SUCCESSFULLY });
        } catch (error) {
            console.error("Error deleting sale: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
