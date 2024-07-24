const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    getVendor: async (req, res) => {
        try {
            const vendorData = await DB.vendor.find({ ...req.query, user_id: req.user.id });
            return response.OK({ res, count: vendorData.length, payload: { vendorData } });
        } catch (error) {
            console.error("Error getting vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    createVendor: async (req, res) => {
        try {
            const { vendorName, mobileNo } = req.body;

            const createVendor = await DB.vendor.create({ vendorName, mobileNo, user_id: req.user.id });

            return response.CREATED({ res, payload: { createVendor } });
        } catch (error) {
            console.error("Error creating vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    updateVendor: async (req, res) => {
        try {
            const updatedVendor = await DB.vendor.findByIdAndUpdate(
                {
                    _id: req.params.id,
                    user_id: req.user.id,
                },
                req.body,
                { new: true }
            );

            if (!updatedVendor) {
                return response.NOT_FOUND({ res });
            }

            return response.OK({ res, payload: { updatedVendor } });
        } catch (error) {
            console.error("Error updating vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    deleteVendor: async (req, res) => {
        try {
            const deleteVendor = await DB.vendor.findByIdAndDelete({
                _id: req.params.id,
                user_id: req.user.id,
            });
            if (!deleteVendor) {
                return response.NOT_FOUND({ res });
            }
            return response.OK({ res, payload: { deleteVendor } });
        } catch (error) {
            console.error("Error deleting vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
