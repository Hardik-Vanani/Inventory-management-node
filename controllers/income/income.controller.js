const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN }, } = require("../../json/enum.json");
const messages = require("../../json/message.json")

module.exports = {

    /* Get Income API*/
    get: async (req, res) => {
        try {
            // Check role or If id is present in params
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };

            const income = await DB.income.find(filter);
            const totalAmount = income.reduce((sum, exp) => sum + (exp.amount || 0), 0);

            return response.OK({ res, count: income.length, message: messages.EXPENSE_FETCHED_SUCCESSFULLY, payload: { totalIncomeAmount: totalAmount, expense } })
        } catch (error) {
            console.error("Error in getting income", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Create Income API */
    create: async (req, res) => {
        try {

        } catch (error) {
            console.error("Error in creating income", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Update Income API */
    update: async (req, res) => {
        try {

        } catch (error) {
            console.error("Error in updating income", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Delete Income API */
    delete: async (req, res) => {
        try {

        } catch (error) {
            console.error("Error in deleting income", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

}