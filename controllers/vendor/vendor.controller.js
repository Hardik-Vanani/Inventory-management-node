const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    /* Get vendor API */
    getVendor: async (req, res) => {
        try {
            // checl if id is present in params
            const filter = req.params.id ? { _id: req.params.id, user_id: req.user.id } : { ...req.query, user_id: req.user.id };
            const vendorData = await DB.vendor.find(filter).select("-createdAt -updatedAt -user_id");

            return response.OK({ res, count: vendorData.length, payload: { vendorData } });
        } catch (error) {
            console.error("Error getting vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Create vendor API */
    createVendor: async (req, res) => {
        try {
            // create vendor
            const createVendor = await DB.vendor.create({ ...req.body, user_id: req.user.id });

            return response.CREATED({ res, payload: { createVendor } });
        } catch (error) {
            console.error("Error creating vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Update vendor API */
    updateVendor: async (req, res) => {
        try {
            // find and update vendor
            const updatedVendor = await DB.vendor
                .findOneAndUpdate(
                    {
                        _id: req.params.id,
                        user_id: req.user.id,
                    },
                    req.body,
                    { new: true }
                )
                .select("-createdAt -updatedAt -user_id ");

            if (!updatedVendor) {
                return response.NOT_FOUND({ res });
            }

            return response.OK({ res, payload: { updatedVendor } });
        } catch (error) {
            console.error("Error updating vendor: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete vendor API */
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
