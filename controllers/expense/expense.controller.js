const response = require("../../helpers/response.helper");
const DB = require("../../models");
const { USER_TYPE: { ADMIN }, } = require("../../json/enum.json");
const messages = require("../../json/message.json")

module.exports = {

    /* Get Expense API*/
    get: async (req, res) => {
        try {
            // Check role or If id is present in params
            const filter = req.params.id ? (req.user.role === ADMIN ? { _id: req.param.id, ...req.query } : { _id: req.params.id, userId: req.user.id, ...req.query }) : req.user.role === ADMIN ? { ...req.query } : { userId: req.user.id, ...req.query };

            const expense = await DB.expense.find(filter).sort({ createdAt: -1 });
            const totalAmount = expense.reduce((sum, exp) => sum + (exp.amount || 0), 0);

            return response.OK({ res, count: expense.length, message: messages.EXPENSE_FETCHED_SUCCESSFULLY, payload: { totalExpenseAmount: totalAmount, expense } })
        } catch (error) {
            console.error("Error in getting expense", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Create Expense API */
    create: async (req, res) => {
        try {
            const userId = req.user.id
            if (!(await DB.user.findOne({ _id: userId }))) return response.NOT_FOUND({ res, message: messages.USERNAME_ALREADY_EXISTS })

            const date = req.body.expenseDate ? new Date(req.body.expenseDate) : new Date();

            await DB.expense.create({ ...req.body, expenseDate: date, userId })
            return response.CREATED({ res, message: messages.EXPENSE_CREATED_SUCCESSFULLY })
        } catch (error) {
            console.error("Error in creating expense", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Update Expense API */
    update: async (req, res) => {
        try {
            if (!(await DB.expense.findOne({ _id: req.params.id, userId: req.user.id }))) return response.NOT_FOUND({ res, message: messages.EXPENSE_NOT_FOUND })

            await DB.expense.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true })
            return response.OK({ res, message: messages.EXPENSE_UPDATED_SUCCESSFULLY })
        } catch (error) {
            console.error("Error in updating expense", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

    /* Delete Expense API */
    delete: async (req, res) => {
        try {
            if (!(await DB.expense.findOne({ _id: req.params.id, userId: req.user.id }))) return response.NOT_FOUND({ res, message: messages.EXPENSE_NOT_FOUND })

            await DB.expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
            return response.OK({ res, message: messages.EXPENSE_DELETED_SUCCESSFULLY })
        } catch (error) {
            console.error("Error in deleting expense", error)
            return response.INTERNAL_SERVER_ERROR({ res })
        }
    },

}