const response = require("../../helpers/response.helper");
const DB = require("../../models");

module.exports = {
    getSummary: async (req, res) => {
        try {
            const user_id = req.user.id;
            const transactionData = await DB.summary
                .find({ ...req.query, user_id })
                .populate({ path: "productID", select: "-__v -user_id" })
                .populate({ path: "vendorID", select: "-__v -user_id" })
                .populate({ path: "customerID", select: "-__v -user_id" })
                .select("-__v");

            return response.OK({ res, count: transactionData.length, payload: { transactionData } });
        } catch {
            console.error(error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },

    deleteSummary: async (req, res) => {
        try {
            const findSummary = await DB.summary.findById(req.params.id);
            if (!findSummary) return response.NOT_FOUND({ res });

            const deleteSummary = await DB.summary.findByIdAndDelete(req.params.id);
            return response.OK({ res, payload: { deleteSummary } });
        } catch (error) {
            console.error(error);
            return response.INTERNAL_SERVER_ERROR({ res });
        }
    },
};
