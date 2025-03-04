const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN }, TRASANCTION_TYPE } = require("../../json/enum.json");
const messages = require("../../json/message.json")

module.exports = {
    /* Get Purchase Bill API */
    getPurchase: async (req, res) => {
        try {
            // Chekck if id is present in params
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };

            // Fetch purchaseBill & purchaseItems with populated productId and vendorId
            const purchaseBills = await DB.purchase.find(filter).populate("userId", "-password -otp -otpExpiry -role -createdAt -updatedAt").populate("vendorId", "-createdAt -updatedAt -userId").sort({ createdAt: -1 }).lean();

            const purchaseBillIds = purchaseBills.map(bill => bill._id);

            const purchaseItems = await DB.purchaseItem.find({
                purchaseBillId: { $in: purchaseBillIds }
            })
            .populate("productId", "-createdAt -updatedAt -userId")
            .lean()
            .select("-createdAt -updatedAt -userId");
            

            // Group purchase items by purchaseBillId
            const purchaseItemsMap = purchaseItems.reduce((acc, item) => {
                const billId = item.purchaseBillId.toString();
                if (!acc[billId]) acc[billId] = [];
                acc[billId].push(item);
                return acc;
            }, {});

            // Attach purchase items to their respective purchase bills
            const result = purchaseBills.map(bill => ({
                ...bill,
                purchaseItems: purchaseItemsMap[bill._id.toString()] || []
            }));

            return response.OK({ res, count: result.length, message: messages.PURCHASE_FETCHED_SUCCESSFULLY, payload: { purchaseBills: result } });
        } catch (error) {
            console.error("Error getting purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create Purchase Bill API */

    createPurchase: async (req, res) => {
        try {

            let { vendorId, purchaseBillItems } = req.body
            const userId = req.user.id;
            if (!(await DB.vendor.findOne({ _id: vendorId, userId }))) return response.NOT_FOUND({ res, message: messages.VENDOR_NOT_FOUND })

            // Check all products existence
            let productUpdates = [];

            for (const item of purchaseBillItems) {
                const product = await DB.product.findOne({ _id: item.productId, userId });
                if (!product) {
                    return response.NOT_FOUND({ res, message: `Product with ID ${item.productId} not found` });
                }
                productUpdates.push({ productId: item.productId, qty: item.qty });
            }

            // Create Purchase Bill
            const purchaseBill = await DB.purchase.create({ ...req.body, userId });

            // Create Purchase Items
            const purchaseItems = purchaseBillItems.map(item => ({
                userId,
                productId: item.productId,
                purchaseBillId: purchaseBill._id,
                vendorId,
                qty: item.qty,
                unit: item.unit,
                rate: item.rate,
                GSTPercentage: item.GSTPercentage,
                GSTAmount: item.GSTAmount,
                amount: item.amount,
                totalAmount: item.totalAmount,
            }));
            await DB.purchaseItem.insertMany(purchaseItems);

            // Update stock in product model (increase stock)
            for (const update of productUpdates) {
                await DB.product.findByIdAndUpdate(update.productId, { $inc: { stock: update.qty } }, { new: true });
            }

            // Create transaction reports
            await DB.report.create({
                purchaseBillId: purchaseBill._id,
                billNo: purchaseBill.billNo,
                billDate: purchaseBill.billDate,
                vendorId: vendorId,
                amount: purchaseBill.totalAmount,
                GSTPercentage: purchaseBill.GSTPercentage,
                GSTAmount: purchaseBill.GSTAmount,
                taxableAmount: purchaseBill.finalAmount,
                transaction_type: TRASANCTION_TYPE.PURCHASE,
                userId,
            });


            return response.CREATED({ res, message: messages.PURCHASE_CREATED_SUCCESSFULLY, payload: { purchaseBill } });

        } catch (error) {
            console.error("Error creating purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update Purchase Bill API */
    updatePurchase: async (req, res) => {
        try {
            const { purchaseBillItems } = req.body;
            const userId = req.user.id;
            const purchaseBillId = req.params.id;

            // Check if purchase bill exists
            const existingPurchaseBill = await DB.purchase.findOne({ _id: purchaseBillId, userId })
            if (!existingPurchaseBill) return response.NOT_FOUND({ res, message: messages.PURCHASE_NOT_FOUND });

            // Retrieve existing purchase items to adjust stock
            const existingItems = await DB.purchaseItem.find({ purchaseBillId });

            // Restore old stock
            for (const item of existingItems) {
                await DB.product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } }, { new: true });
            }

            // Delete existing purchase items
            await DB.purchaseItem.deleteMany({ purchaseBillId });

            // Check all products existence
            let productUpdates = [];
            for (const item of purchaseBillItems) {
                const product = await DB.product.findOne({ _id: item.productId, userId });
                if (!product) {
                    return response.NOT_FOUND({ res, message: `Product with ID ${item.productId} not found` });
                }
                productUpdates.push({ productId: item.productId, qty: item.qty });
            }

            // Update Purchase Bill
            await DB.purchase.findByIdAndUpdate(purchaseBillId, { ...req.body }, { new: true });

            // Create new purchase items
            const newPurchaseItems = purchaseBillItems.map(item => ({
                userId,
                productId: item.productId,
                purchaseBillId,
                vendorId: existingPurchaseBill.vendorId,
                qty: item.qty,
                unit: item.unit,
                rate: item.rate,
                GSTPercentage: item.GSTPercentage,
                GSTAmount: item.GSTAmount,
                amount: item.amount,
                totalAmount: item.totalAmount,
            }));
            await DB.purchaseItem.insertMany(newPurchaseItems);

            // Update stock in product model (increase stock)
            for (const update of productUpdates) {
                await DB.product.findByIdAndUpdate(update.productId, { $inc: { stock: update.qty } }, { new: true });
            }

            // Update report
            if (await DB.report.findOne({ purchaseBillId })) {
                await DB.report.findOneAndUpdate({ purchaseBillId }, {
                    billNo: req.body.billNo,
                    billDate: req.body.billDate,
                    amount: req.body.totalAmount,
                    GSTPercentage: req.body.GSTPercentage,
                    GSTAmount: req.body.GSTAmount,
                    taxableAmount: req.body.finalAmount,
                }, { new: true })
            }
            return response.OK({ res, message: messages.PURCHASE_UPDATED_SUCCESSFULLY });
        } catch (error) {
            console.error("Error updating purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete Purchase Bill API */
    deletePurchase: async (req, res) => {
        try {
            if (!(await DB.purchase.findOne({ _id: req.params.id }))) return response.NOT_FOUND({ res, message: messages.PURCHASE_NOT_FOUND });

            await DB.purchase.findByIdAndDelete(req.params.id)
            await DB.purchaseItem.deleteMany({ purchaseBillId: req.params.id })
            await DB.report.deleteMany({ purchaseBillId: req.params.id })

            return response.OK({ res, message: messages.PURCHASE_DELETED_SUCCESSFULLY });
        } catch (error) {
            console.error("Error deleting purchase: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
