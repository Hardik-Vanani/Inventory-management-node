const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    getCustomer: async (req, res) => {
        try {
            // const query = { ...req.query, user_id };
            const customerData = await DB.customer
                .find({
                    ...req.query,
                    user_id: req.user.id,
                })
                .select("-__v");
            return response.OK({ res, count: customerData.length, payload: { customerData } });
        } catch (error) {
            console.error("Error getting customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    createCustomer: async (req, res) => {
        try {
            const { customerName, mobileNo } = req.body;

            const createCustomer = await DB.customer.create({ customerName, mobileNo, user_id: req.user.id });

            return response.OK({ res, payload: { createCustomer } });
        } catch (error) {
            console.error("Error creating customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    updateCustomer: async (req, res) => {
        try {
            const findCustomer = await DB.customer.findOne({ _id: req.params.id, user_id: req.user.id });
            if (!findCustomer) return response.NOT_FOUND({ res });

            const updatedCustomer = await DB.customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

            return response.OK({ res, payload: { updatedCustomer } });
        } catch (error) {
            console.error("Error updating customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    deleteCustomer: async (req, res) => {
        try {
            const findCustomer = await DB.customer.findOne({ _id: req.params.id, user_id: req.user.id });
            if (!findCustomer) return response.NOT_FOUND({ res });

            const deleteCustomer = await DB.customer.findByIdAndDelete(req.params.id);

            return response.OK({ res, payload: { deleteCustomer } });
        } catch (error) {
            console.error("Error deleting customer: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
