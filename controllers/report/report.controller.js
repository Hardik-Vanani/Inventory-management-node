const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN } } = require('../../json/enum.json')

module.exports = {
    /* Get report API */
    getReports: async (req, res) => {
        try {
            const userId = req.user.id;
            const filter = req.params.id ? { _id: req.params.id, userId } : { ...req.query, userId };
            const transactionData = await DB.report
                .find(filter)
                .sort({ createdAt: -1 })
                .populate("purchaseBillId", "-createdAt -updatedAt")
                .populate("saleBillId", "-createdAt -updatedAt")
                .populate("customerId", "-createdAt -updatedAt")
                .populate("vendorId", "-createdAt -updatedAt")
                .select("-userId -createdAt -updatedAt");
            return response.OK({ res, count: transactionData.length, payload: { transactionData } });
        } catch (error) {
            console.error("Error getting report: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete report API */
    deleteReport: async (req, res) => {
        try {
            // Delete report

            const filter = req.user.role === ADMIN ? { _id: req.params.id } : { _id: req.params.id, userId: req.user.id };

            const deleteSummary = await DB.report.findByIdAndDelete(filter);
            if (!deleteSummary) return response.NOT_FOUND({ res });

            return response.OK({ res, payload: { deleteSummary } });
        } catch (error) {
            console.error("Error deleting report: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
