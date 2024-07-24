const { validate } = require("express-validation");
const Joi = require("joi");

module.exports = {
    createSale: validate({
        body: Joi.object({
            bill_no: Joi.number().required(),
            customerDetail: Joi.required(),
            productDetail: Joi.required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),
        }),
    }),

    updateSale: validate({
        body: Joi.object({
            bill_no: Joi.number().required(),
            customerDetail: Joi.required(),
            productDetail: Joi.required(),
            qty: Joi.number().required(),
            price: Joi.number().required(),     
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
