const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN }, } = require("../../json/enum.json");
const messages = require("../../json/message.json")


module.exports = {
    /* Get product API */
    getProduct: async (req, res) => {
        try {
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };
            const productData = await DB.product.find(filter).select("-createdAt -updatedAt");

            return response.OK({ res, count: productData.length, message: messages.PRODUCT_FETCHED_SUCCESSFULLY, payload: { productData } });
        } catch (error) {
            console.error("Error getting product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },


    /* Create new product API */
    createProduct: async (req, res) => {
        try {
            const createProduct = await DB.product.create({ ...req.body, userId: req.user.id });

            return response.CREATED({ res, message: messages.PRODUCT_CREATED_SUCCESSFULLY, payload: { createProduct } });
        } catch (error) {
            console.error("Error creating product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },


    /* Update product API */
    updateProduct: async (req, res) => {
        try {
            const updateProduct = await DB.product.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
            if (!updateProduct) return response.NOT_FOUND({ res, message: messages.PRODUCT_CREATED_SUCCESSFULLY, });

            return response.OK({ res, message: messages.PRODUCT_UPDATED_SUCCESSFULLY, payload: { updateProduct } });
        } catch (error) {
            console.error("Error updating product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },


    /* Delete product API */
    deleteProduct: async (req, res) => {
        try {
            const deleteProduct = await DB.product.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
            if (!deleteProduct) return response.NOT_FOUND({ res, message: messages.PRODUCT_NOT_FOUND, });

            return response.OK({ res, message: messages.PRODUCT_DELETED_SUCCESSFULLY, payload: { deleteProduct } });
        } catch (error) {
            console.error("Error deleting product: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
