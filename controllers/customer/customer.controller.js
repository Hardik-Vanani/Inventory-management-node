const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    /* Get customer API */
    getCustomer: async (req, res) => {
        try {
            const filter = req.params.id
                ? { _id: req.params.id, user_id: req.user.id }
                : { ...req.query, user_id: req.user.id };
            const customerData = await DB.customer
                .find(filter)
                .select("-user_id -createdAt -updatedAt");

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

    /* Create customer API */
    createCustomer: async (req, res) => {
        try {
            const createCustomer = await DB.customer.create({
                ...req.body,
                user_id: req.user.id,
            });

            return response.OK({ res, payload: { createCustomer } });
        } catch (error) {
            console.error("Error creating customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update customer API */
    updateCustomer: async (req, res) => {
        try {
            const updatedCustomer = await DB.customer
                .findOneAndUpdate(
                    {
                        _id: req.params.id,
                        user_id: req.user.id,
                    },
                    req.body,
                    { new: true }
                )
                .select("-createdAt -updatedAt -user_id");

            return response.OK({ res, payload: { updatedCustomer } });
        } catch (error) {
            console.error("Error updating customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete customer API */
    deleteCustomer: async (req, res) => {
        try {
            const findCustomer = await DB.customer.findOne({
                _id: req.params.id,
                user_id: req.user.id,
            });
            if (!findCustomer) return response.NOT_FOUND({ res });

            const deleteCustomer = await DB.customer.findByIdAndDelete(
                req.params.id
            );

            return response.OK({ res, payload: { deleteCustomer } });
        } catch (error) {
            console.error("Error deleting customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
