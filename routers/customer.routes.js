const express = require("express");
const router = express.Router();
const { auth, validateObjectId } = require("../middleware/auth");
const customer = require("../schemas/customer.schema");
const response = require("../helpers/response.helper");

router.get("/", auth, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: true, error: req.error });
        }

        const user_id = req.user.id;
        // const query = { ...req.query, user_id };
        const customerData = await customer.find({ ...req.query, user_id }).select("-__v");
        return response.OK({ res, count: customerData.length, payload: { customerData } });
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
        const { customerName, mobileNo } = req.body;
        if (!customerName || !mobileNo) return response.ALL_REQUIRED({ res });

        const createCustomer = await customer.create({ customerName, mobileNo, user_id: req.user.id });

        return response.OK({ res, payload: { createCustomer } });
    } catch (error) {
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

router.put("/update/:id", auth, validateObjectId, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: true, error: req.error });
        }

        const { customerName, mobileNo } = req.body;
        if (!customerName || !mobileNo) return response.ALL_REQUIRED({ res });

        const findCustomer = await customer.findOne({ _id: req.params.id, user_id: req.user.id });
        if (!findCustomer) return response.NOT_FOUND({ res });

        const updatedCustomer = await customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return response.OK({ res, payload: { updatedCustomer } });
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

        const findCustomer = await customer.findOne({ _id: req.params.id, user_id: req.user.id });
        if (!findCustomer) return response.NOT_FOUND({ res });

        const deleteCustomer = await customer.findByIdAndDelete(req.params.id);

        return response.OK({ res, payload: { deleteCustomer } });
    } catch (error) {
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});
module.exports = router;
