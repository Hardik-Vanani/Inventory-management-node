const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    createCustomer: validate({
        body: Joi.object({
            customerName: Joi.string.required(),
            mobileNo: Joi.number().max(9999999999).required(),
        }),
    }),

    updateCustomer: validate({
        body: Joi.object({
            customerName: Joi.string().required(),
            mobileNo: Joi.number().max(9999999999),
        }),

        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),

    deleteCustomer: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
};
