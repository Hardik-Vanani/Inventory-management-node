const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    create: validate({
        body: Joi.object({
            expenseName: Joi.string().required(),
            supplierName: Joi.string(),
            paymentMode: Joi.string(),
            amount: Joi.number(),
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
            expenseName: Joi.string().required(),
            supplierName: Joi.string(),
            paymentMode: Joi.string(),
            amount: Joi.number(),
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