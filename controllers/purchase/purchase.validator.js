const { validate } = require("express-validation");
const Joi = require("joi");

// Validator for routes
module.exports = {
    createPurchase: validate({
        body: Joi.object({
            billNo: Joi.string().required(),
            vendorId: Joi.string().required(),
            productId: Joi.string().required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
            amount: Joi.number().required(),
            date: Joi.string().required(),
        }),
    }),

    updatePurchase: validate({
        body: Joi.object({
            billNo: Joi.number().required(),
            vendorId: Joi.required(),
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

    deletePurchase: validate({
        params: Joi.object({
            id: Joi.string()
                .pattern(/^[0-9a-fA-F]{24}$/)
                .message("Invalid ObjectId")
                .required(),
        }),
    }),
};
