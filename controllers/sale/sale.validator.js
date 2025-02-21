const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    createSale: validate({
        body: Joi.object({
            billNo: Joi.number().required(),
            customerId: Joi.required(),
            productId: Joi.required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
            amount: Joi.number().required(),
            date: Joi.string().required(),
        }),
    }),

    updateSale: validate({
        body: Joi.object({
            billNo: Joi.number().required(),
            customerId: Joi.required(),
            productId: Joi.required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
            amount: Joi.number().required(),
            date: Joi.string().required(),
            _id: Joi.string().optional(),
        }),

        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),

    deleteSale: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
};
