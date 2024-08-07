const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    createPurchase: validate({
        body: Joi.object({
            bill_no: Joi.string().required(),
            vendorDetail: Joi.string().required(),
            productDetail: Joi.string().required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
            amount: Joi.number().required(),
            date: Joi.string().required(),
        }),
    }),

    updatePurchase: validate({
        body: Joi.object({
            bill_no: Joi.number().required(),
            vendorDetail: Joi.required(),
            productDetail: Joi.required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
            amount: Joi.number().required(),
            date: Joi.string().required(),
            _id: Joi.string().required(),
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
