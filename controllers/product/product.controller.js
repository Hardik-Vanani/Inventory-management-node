const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    getProduct: async (req, res) => {
        try {
            const user_id = req.user.id;
            const productData = await DB.product.find({ ...req.query, user_id }).select("-__v");
            return response.OK({ res, count: productData.length, payload: { productData } });
        } catch (error) {
            console.error("Error getting product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    createProduct: async (req, res) => {
        try {
            const { productName } = req.body;

            const createProduct = await DB.product.create({ productName, user_id: req.user.id });

            return response.OK({ res, payload: { createProduct } });
        } catch (error) {
            console.error("Error creating product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const findProduct = await DB.product.find({ _id: req.params.id, user_id: req.user.id });
            if (!findProduct) return response.NOT_FOUND({ res });

            const updateProduct = await DB.product.findByIdAndUpdate(req.params.id, req.body, { new: true });

            return response.OK({ res, payload: { updateProduct } });
        } catch (error) {
            console.error("Error updating product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const findProduct = await DB.product.find({ _id: req.params.id, user_id: req.user.id });
            if (!findProduct) return response.NOT_FOUND({ res });

            const deleteProduct = await DB.product.findByIdAndDelete(req.params.id);

            return response.OK({ res, payload: { deleteProduct } });
        } catch (error) {
            console.error("Error deleting product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
