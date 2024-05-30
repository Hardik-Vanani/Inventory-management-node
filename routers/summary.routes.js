const express = require("express");
const router = express.Router();
const customer = require("../schemas/customer.schema");
const vendor = require("../schemas/vendor.schema");
const product = require("../schemas/product.schema");
const summary = require("../schemas/summary.schema");
const { auth, validateObjectId } = require("../middleware/auth");

const response = require("../helpers/response.helper");

router.get("/", auth, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }

        const user_id = req.user.id;
        const transactionData = await summary
            .find({ ...req.query, user_id })
            .populate({ path: "productID", select: "-__v -user_id" })
            .populate({ path: "vendorID", select: "-__v -user_id" })
            .populate({ path: "customerID", select: "-__v -user_id" })
            .select("-__v");

        return response.OK({ res, count: transactionData.length, payload: { transactionData } });
    } catch {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

router.delete("/delete/:id", auth, validateObjectId, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }

        const findSummary = await summary.findById(req.params.id);
        if (!findSummary) return response.NOT_FOUND({ res });

        const deleteSummary = await summary.findByIdAndDelete(req.params.id);
        return response.OK({ res, payload: { deleteSummary } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

module.exports = router;
