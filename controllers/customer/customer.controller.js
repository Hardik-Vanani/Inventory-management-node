const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN }, } = require("../../json/enum.json");
const messages = require("../../json/message.json")

module.exports = {
    /* Get customer API */
    getCustomer: async (req, res) => {
        try {
            // Check role or If id is present in params
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };

            const customerData = await DB.customer.find(filter).select("-createdAt -updatedAt").sort({ createdAt: -1 });

            // return response
            return response.OK({
                res, count: customerData.length, message: messages.CUSTOMER_FETCHED_SUCCESSFULLY, payload: { customerData },
            });
        } catch (error) {
            console.error("Error getting customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create new customer API */
    createCustomer: async (req, res) => {
        try {
            const createCustomer = await DB.customer.create({ ...req.body, userId: req.user.id, });

            // return response
            return response.OK({ res, message: messages.CUSTOMER_CREATED_SUCCESSFULLY, payload: { createCustomer } });
        } catch (error) {
            console.error("Error creating customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update existing customer API */
    updateCustomer: async (req, res) => {
        try {
            const updatedCustomer = await DB.customer.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
            if (!updatedCustomer) return response.NOT_FOUND({ res, message: messages.CUSTOMER_NOT_FOUND });

            // return response
            return response.OK({ res, message: messages.CUSTOMER_UPDATED_SUCCESSFULLY, payload: { updatedCustomer } });
        } catch (error) {
            console.error("Error updating customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete customer API */
    deleteCustomer: async (req, res) => {
        try {
            if (!(await DB.customer.findOne({ _id: req.params.id, userId: req.user.id }))) return response.NOT_FOUND({ res, message: messages.CUSTOMER_NOT_FOUND });

            await DB.customer.findByIdAndDelete(req.params.id);

            // return response
            return response.OK({ res, message: messages.CUSTOMER_DELETED_SUCCESSFULLY });
        } catch (error) {
            console.error("Error deleting customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
