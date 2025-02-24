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

            return response.OK({ res, count: income.length, message: messages.INCOME_FETCHED_SUCCESSFULLY, payload: { totalIncomeAmount: totalAmount, income } })
        } catch (error) {
            console.error("Error in getting income", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Create Income API */
    create: async (req, res) => {
        try {
            const userId = req.user.id
            if (!(await DB.user.findOne({ _id: userId }))) return response.NOT_FOUND({ res, message: messages.USER_NOT_FOUND })

            await DB.income.create({ ...req.body, userId })
            return response.CREATED({ res, message: messages.INCOME_CREATED_SUCCESSFULLY })
        } catch (error) {
            console.error("Error in creating income", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Update Income API */
    update: async (req, res) => {
        try {
            if (!(await DB.income.findOne({ _id: req.params.id, userId: req.user.id }))) return response.NOT_FOUND({ res, message: messages.INCOME_NOT_FOUND })

            await DB.income.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true })
            return response.OK({ res, message: messages.INCOME_UPDATED_SUCCESSFULLY })

        } catch (error) {
            console.error("Error in updating income", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Delete Income API */
    delete: async (req, res) => {
        try {
            if (!(await DB.income.findOne({ _id: req.params.id, userId: req.user.id }))) return response.NOT_FOUND({ res, message: messages.INCOME_NOT_FOUND })

            await DB.income.findByIdAndDelete({ _id: req.params.id, userId: req.user.id })
            return response.OK({ res, message: messages.INCOME_DELETED_SUCCESSFULLY })
        } catch (error) {
            console.error("Error in deleting income", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

}