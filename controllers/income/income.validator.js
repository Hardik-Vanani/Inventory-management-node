const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    create: validate({
        body: Joi.object({
            incomeName: Joi.string().required(),
            incomeDate: Joi.date(),
            supplierName: Joi.string(),
            paymentMode: Joi.string(),
            amount: Joi.number(),
            note: Joi.string()
        })
    }),

    update: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
        body: Joi.object({
            incomeName: Joi.string().required(),
            incomeDate: Joi.date(),
            supplierName: Joi.string(),
            paymentMode: Joi.string(),
            amount: Joi.number(),
            note: Joi.string()
        })
    }),

    delete: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
}