const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN }, } = require("../../json/enum.json");
const messages = require("../../json/message.json")

module.exports = {
    /* Get vendor API */
    getVendor: async (req, res) => {
        try {
            // check if id is present in params
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };

            const vendorData = await DB.vendor.find(filter).select("-createdAt -updatedAt -userId");

            return response.OK({ res, message: messages.VENDOR_FETCHED_SUCCESSFULLY, count: vendorData.length, payload: { vendorData } });
        } catch (error) {
            console.error("Error getting vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create vendor API */
    createVendor: async (req, res) => {
        try {
            // create vendor
            const createVendor = await DB.vendor.create({ ...req.body, userId: req.user.id });

            return response.CREATED({ res, message: messages.VENDOR_CREATED_SUCCESSFULLY, payload: { createVendor } });
        } catch (error) {
            console.error("Error creating vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update vendor API */
    updateVendor: async (req, res) => {
        try {
            // Find and update vendor
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.id };
            const updatedVendor = await DB.vendor.findOneAndUpdate(filter, req.body, { new: true }).select("-createdAt -updatedAt -userId ");

            if (!updatedVendor) {
                return response.NOT_FOUND({ res, message: messages.VENDOR_NOT_FOUND });
            }

            return response.OK({ res, message: messages.VENDOR_UPDATED_SUCCESSFULLY, payload: { updatedVendor } });
        } catch (error) {
            console.error("Error updating vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete vendor API */
    deleteVendor: async (req, res) => {
        try {
            // Find and delete vendor
            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.id };
            const deleteVendor = await DB.vendor.findByIdAndDelete(filter);

            if (!deleteVendor) {
                return response.NOT_FOUND({ res, message: messages.VENDOR_NOT_FOUND });
            }
            return response.OK({ res, message: messages.VENDOR_DELETED_SUCCESSFULLY, payload: { deleteVendor } });
        } catch (error) {
            console.error("Error deleting vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
