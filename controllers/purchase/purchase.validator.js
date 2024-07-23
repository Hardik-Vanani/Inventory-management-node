const { validate } = require("express-validation");
const Joi = require("joi");
const { createPurchase, updatePurchase, deletePurchase } = require("./purchase.controller");

module.exports = {
    createPurchase: validate({
        body: Joi.object({
            bill_no: Joi.number.required(),
            vendorDetail: Joi.required(),
            productDetail: Joi.required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
            amount: Joi.number().required(),
        }),
    }),

    updatePurchase: validate({
        body: Joi.object({
            bill_no: Joi.number.required(),
            vendorDetail: Joi.required(),
            productDetail: Joi.required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
            amount: Joi.number().required(),
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
