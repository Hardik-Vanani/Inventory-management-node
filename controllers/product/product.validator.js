const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    createProduct: validate({
        body: Joi.object({
            productName: Joi.string().required(),
        }),
    }),

    updateProduct: validate({
        body: Joi.object({
            productName: Joi.string().required(),
            stock: Joi.number().required(),
            _id: Joi.string().optional(),
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
