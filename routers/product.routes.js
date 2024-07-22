const express = require("express");
const router = express.Router();
const product = require("../models/product.model");
const { auth, validateObjectId } = require("../middleware/auth.middleware");

const response = require("../helpers/response.helper");
const { request } = require("http");

router.get("/", auth, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }
        const user_id = req.user.id;
        const productData = await product.find({ ...req.query, user_id }).select("-__v");
        return response.OK({ res, count: productData.length, payload: { productData } });
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

        const { productName } = req.body;
        if (!productName) return response.ALL_REQUIRED({ res });

        const createProduct = await product.create({ productName, user_id: req.user.id });

        return response.OK({ res, payload: { createProduct } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

router.put("/update/:id", auth, validateObjectId, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }

        const { productName, stock } = req.body;
        if (!productName) return response.ALL_REQUIRED({ res });

        const findProduct = await product.find({ _id: req.params.id, user_id: req.user.id });
        if (!findProduct) return response.NOT_FOUND({ res });

        const updateProduct = await product.findByIdAndUpdate(req.params.id, req.body, { new: true });

        return response.OK({ res, payload: { updateProduct } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

router.delete("/delete/:id", auth, validateObjectId, async (req, res) => {
    try {
        if (req.error) {
            return res.status(401).json({ success: false, error: req.error });
        }
        const findProduct = await product.find({ _id: req.params.id, user_id: req.user.id });
        if (!findProduct) return response.NOT_FOUND({ res });

        const deleteProduct = await product.findByIdAndDelete(req.params.id);

        return response.OK({ res, payload: { deleteProduct } });
    } catch (error) {
        console.error(error);
        return response.INTERNAL_SERVER_ERROR({ res });
    }
});

module.exports = router;
