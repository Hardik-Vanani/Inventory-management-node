const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    /* Get report API */
    getReports: async (req, res) => {
        try {
            const userId = req.user.id;
            const filter = req.params.id ? { _id: req.params.id, userId } : { ...req.query, userId };
            const transactionData = await DB.report
                .find(filter)
                .populate({ path: "productID", select: "-userId -createdAt -updatedAt" })
                .populate({ path: "vendorId", select: "-userId -createdAt -updatedAt" })
                .populate({ path: "customerID", select: "-userId -createdAt -updatedAt" })
                .select("-userId -createdAt -updatedAt");

            return response.OK({ res, count: transactionData.length, payload: { transactionData } });
        } catch {
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
