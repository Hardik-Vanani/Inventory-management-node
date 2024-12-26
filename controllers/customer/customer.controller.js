const response = require("../../helpers/response.helper");
const DB = require("../../models");
const {
    USER_TYPE: { ADMIN },
} = require("../../json/message.json");

module.exports = {
    /* Get customer API */
    getCustomer: async (req, res) => {
        try {
            // Check role or If id is present in params
            // const filter = req.params.id ? { _id: req.params.id, user_id: req.user.id } : { ...req.query, user_id: req.user.id };
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, user_id: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { user_id: req.user.id, ...req.query };

            const customerData = await DB.customer.find(filter).select("-createdAt -updatedAt");

            // return response
            return response.OK({
                res,
                count: customerData.length,
                payload: { customerData },
            });
        } catch (error) {
            console.error("Error getting customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create new customer API */
    createCustomer: async (req, res) => {
        try {
            const createCustomer = await DB.customer.create({
                ...req.body,
                user_id: req.user.id,
            });

            // return response
            return response.OK({ res, payload: { createCustomer } });
        } catch (error) {
            console.error("Error creating customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update existing customer API */
    updateCustomer: async (req, res) => {
        try {
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, user_id: req.user.id };
            const updatedCustomer = await DB.customer.findOneAndUpdate(filter, req.body, { new: true });
            if (!updatedCustomer) return response.NOT_FOUND({ res });

            // return response
            return response.OK({ res, payload: { updatedCustomer } });
        } catch (error) {
            console.error("Error updating customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete customer API */
    deleteCustomer: async (req, res) => {
        try {
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, user_id: req.user.id };
            const findCustomer = await DB.customer.findOne(filter);
            if (!findCustomer) return response.NOT_FOUND({ res });

            const deleteCustomer = await DB.customer.findByIdAndDelete(req.params.id);

            // return response
            return response.OK({ res, payload: { deleteCustomer } });
        } catch (error) {
            console.error("Error deleting customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
