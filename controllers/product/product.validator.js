const { validate } = require("express-validation");
const Joi = require("joi");

// Validator for routes
module.exports = {
    createProduct: validate({
        body: Joi.object({
            productName: Joi.string().required(),
            unit: Joi.string(),
            hsnCode: Joi.string(),
        }),
    }),

    updateProduct: validate({
        body: Joi.object({
            productName: Joi.string().required(),
            stock: Joi.number().required(),
            unit: Joi.string(),
            hsnCode: Joi.string(),
        }),

        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),

    deleteProduct: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
};
