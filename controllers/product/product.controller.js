const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN }, } = require("../../json/enum.json");

module.exports = {
    /* Get product API */
    getProduct: async (req, res) => {
        try {
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, user_id: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { user_id: req.user.id, ...req.query };
            const productData = await DB.product.find(filter).select("-createdAt -updatedAt");

            return response.OK({ res, count: productData.length, payload: { productData } });
        } catch (error) {
            console.error("Error getting product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create new product API */
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
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, user_id: req.user.id };

            const updateProduct = await DB.product.findOneAndUpdate(filter, req.body, { new: true });
            if (!updateProduct) return response.NOT_FOUND({ res });

            return response.OK({ res, payload: { updateProduct } });
        } catch (error) {
            console.error("Error updating product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete product API */
    deleteProduct: async (req, res) => {
        try {
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, user_id: req.user.id };

            const deleteProduct = await DB.product.findByIdAndDelete(filter);
            if (!deleteProduct) return response.NOT_FOUND({ res });

            return response.OK({ res, payload: { deleteProduct } });
        } catch (error) {
            console.error("Error deleting product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
