const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    /* Get report API */
    getReports: async (req, res) => {
        try {
            const user_id = req.user.id;
            const transactionData = await DB.report
                .find({ ...req.query, user_id })
                .populate({ path: "productID", select: "-user_id -createdAt -updatedAt" })
                .populate({ path: "vendorID", select: "-user_id -createdAt -updatedAt" })
                .populate({ path: "customerID", select: "-user_id -createdAt -updatedAt" })
                .select("-user_id -createdAt -updatedAt");

            return response.OK({ res, count: transactionData.length, payload: { transactionData } });
        } catch {
            console.error("Error getting report: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    /* Delete report API */
    deleteReport: async (req, res) => {
        try {
            const findSummary = await DB.report.findById(req.params.id);
            if (!findSummary) return response.NOT_FOUND({ res });

            const deleteSummary = await DB.report.findByIdAndDelete({
                _id: req.params.id,
                user_id: req.user.id,
            });
            return response.OK({ res, payload: { deleteSummary } });
        } catch (error) {
            console.error("Error deleting report: ", error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
