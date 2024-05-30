const express = require("express");
const router = express.Router();
const { auth, validateObjectId } = require("../middleware/auth");
const { HTTP_CODE, MESSAGE } = require("../json/message.json");
const response = require("../helpers/response.helper");

const vendor = require("../schemas/vendor.schema");
const { error } = require("console");

router.get("/", auth, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: true, error: req.error });
        }
        const vendorData = await vendor.find(req.query);
        return response.OK({ res, count: vendorData.length, payload: { vendorData } });
    } catch (error) {
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

router.post("/create", auth, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: true, error: req.error });
        }

        const { vendorName, mobileNo } = req.body;
        if (!vendorName || !mobileNo) return response.ALL_REQUIRED({ res });

        const createVendor = await vendor.create({ vendorName, mobileNo, user_id: req.user.id });

        return response.CREATED({ res, payload: { createVendor } });
    } catch (error) {
        console.error("Error creating vendor:", error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

router.put("/update/:id", auth, validateObjectId, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: true, error: req.error });
        }

        const { vendorName, mobileNo } = req.body;
        if (!vendorName || !mobileNo) return response.ALL_REQUIRED({ res });

        const updatedVendor = await vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedVendor) {
            return response.NOT_FOUND({ res });
        }

        return response.OK({ res, payload: { updatedVendor } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

router.delete("/delete/:id", auth, validateObjectId, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: true, error: req.error });
        }
        const deleteVendor = await vendor.findByIdAndDelete(req.params.id);
        if (!deleteVendor) {
            return response.NOT_FOUND({ res });
        }
        return response.OK({ res, payload: { deleteVendor } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

module.exports = router;
