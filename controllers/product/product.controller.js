const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    /* Get product API */
    getProduct: async (req, res) => {
        try {
            const filter = req.params.id ? { _id: req.params.id, user_id: req.user.id } : { ...req.query, user_id: req.user.id };
            const productData = await DB.product.find(filter).select(" -createdAt -updatedAt -user_id");

            return response.OK({ res, count: productData.length, payload: { productData } });
        } catch (error) {
            console.error("Error getting product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create product API */
    createProduct: async (req, res) => {
        try {
            const createProduct = await DB.product.create({ ...req.body, user_id: req.user.id });

            return response.OK({ res, payload: { createProduct } });
        } catch (error) {
            console.error("Error creating product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update product API */
    updateProduct: async (req, res) => {
        try {
            const findProduct = await DB.product.find({ _id: req.params.id, user_id: req.user.id });
            if (!findProduct) return response.NOT_FOUND({ res });

            const updateProduct = await DB.product.findOneAndUpdate(req.params.id, req.body, { new: true });

            return response.OK({ res, payload: { updateProduct } });
        } catch (error) {
            console.error("Error updating product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete product API */
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
